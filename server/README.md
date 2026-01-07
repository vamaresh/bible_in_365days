Push server scaffold

1. Install dependencies:
   npm install

2. Generate VAPID keys (in node REPL):
   const webpush = require('web-push');
   webpush.generateVAPIDKeys()

3. Set environment variables and start:
   export VAPID_PUBLIC="<your-public-key>"
   export VAPID_PRIVATE="<your-private-key>"
   npm start

Endpoints:
- GET /vapidPublicKey -> { publicKey }
- POST /subscribe -> save subscription JSON
- POST /send { title, body } -> send push to all saved subscriptions
 - POST /subscribe { userId, reminderTime, tzOffsetMinutes, subscription } -> save subscription per-user
   - `reminderTime` should be `HH:MM` local time
   - `tzOffsetMinutes` is minutes offset from UTC (send `-new Date().getTimezoneOffset()` from client)

Scheduler:
- The server runs a minute-based scheduler that computes each subscriber's local time using `tzOffsetMinutes` and sends a push when the local time matches `reminderTime`. The server records `lastSentDate` per subscription to avoid duplicate sends on the same day.

Note: For production, store subscriptions in a database (Firebase, Postgres etc.) and add auth.
