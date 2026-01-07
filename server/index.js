// Minimal Push server scaffold using web-push
// Usage:
// 1. generate VAPID keys: in node REPL or using web-push: require('web-push').generateVAPIDKeys()
// 2. set env variables VAPID_PUBLIC and VAPID_PRIVATE
// 3. npm install && npm start

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const SUBS_FILE = path.join(__dirname, 'subscriptions.json');

const app = express();
app.use(bodyParser.json());

const VAPID_PUBLIC = process.env.VAPID_PUBLIC || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(
    'mailto:admin@example.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
  );
} else {
  console.warn('VAPID keys not set. Set VAPID_PUBLIC and VAPID_PRIVATE env vars for push to work.');
}

const readSubs = () => {
  try {
    if (!fs.existsSync(SUBS_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUBS_FILE));
  } catch (e) {
    return [];
  }
};

const writeSubs = (subs) => fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));

app.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC });
});

// Save subscription (client will POST subscription object)
// Subscribe endpoint expects { userId, reminderTime, tzOffsetMinutes, subscription }
app.post('/subscribe', (req, res) => {
  const { userId, reminderTime, tzOffsetMinutes, subscription } = req.body || {};
  if (!subscription || !subscription.endpoint) return res.status(400).send('Invalid subscription');
  if (!userId) return res.status(400).send('Missing userId');

  const subs = readSubs();
  // find or create record for this endpoint
  const existing = subs.find(s => s.endpoint === subscription.endpoint);
  const record = {
    userId,
    endpoint: subscription.endpoint,
    subscription,
    reminderTime: reminderTime || null,
    tzOffsetMinutes: typeof tzOffsetMinutes === 'number' ? tzOffsetMinutes : 0,
    lastSentDate: existing ? existing.lastSentDate : null
  };

  if (existing) {
    // update existing
    Object.assign(existing, record);
  } else {
    subs.push(record);
  }

  writeSubs(subs);
  res.json({ success: true });
});

// Send a push to all saved subscriptions (for testing/send from server)
app.post('/send', async (req, res) => {
  const { title, body } = req.body || {};
  const payload = JSON.stringify({ title: title || 'Bible Reminder', body: body || 'Time to read!' });
  const subs = readSubs();
  const results = [];
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ endpoint: sub.endpoint, status: 'sent' });
    } catch (err) {
      results.push({ endpoint: sub.endpoint, status: 'error', error: err.message });
    }
  }
  res.json({ results });
});

// Scheduler: check subscriptions every minute and send reminders when user's local time matches reminderTime
setInterval(async () => {
  try {
    const subs = readSubs();
    if (!subs.length) return;

    const nowUtc = new Date();
    const results = [];

    for (const s of subs) {
      if (!s.reminderTime) continue;
      // compute user's local time by applying tz offset (minutes). tzOffsetMinutes is minutes ahead of UTC
      const userNow = new Date(nowUtc.getTime() + (s.tzOffsetMinutes || 0) * 60000);
      const hh = String(userNow.getHours()).padStart(2, '0');
      const mm = String(userNow.getMinutes()).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      // send only once per day - check lastSentDate
      const todayStr = userNow.toISOString().split('T')[0];
      if (timeStr === s.reminderTime && s.lastSentDate !== todayStr) {
        try {
          const payload = JSON.stringify({ title: 'Bible Challenge Reminder', body: `Time to read!` });
          await webpush.sendNotification(s.subscription, payload);
          s.lastSentDate = todayStr;
          results.push({ endpoint: s.endpoint, status: 'sent' });
        } catch (err) {
          results.push({ endpoint: s.endpoint, status: 'error', error: err.message });
        }
      }
    }
    if (results.length) writeSubs(readSubs().map(sub => {
      const found = subs.find(s => s.endpoint === sub.endpoint);
      return found || sub;
    }));
  } catch (e) {
    console.error('Scheduler error', e);
  }
}, 60 * 1000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Push server running on http://localhost:${PORT}`);
});
