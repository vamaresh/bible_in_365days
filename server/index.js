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
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) return res.status(400).send('Invalid subscription');
  const subs = readSubs();
  // avoid duplicates
  if (!subs.find(s => s.endpoint === subscription.endpoint)) {
    subs.push(subscription);
    writeSubs(subs);
  }
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Push server running on http://localhost:${PORT}`);
});
