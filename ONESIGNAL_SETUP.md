# OneSignal Setup Guide for Bible Challenge App

## Step 1: Create OneSignal Account

1. Go to https://onesignal.com and create a free account
2. Click "New App/Website"
3. Name it "Bible Challenge 2026"
4. Select "Web Push" as the platform

## Step 2: Configure Web Push

1. In OneSignal dashboard, go to Settings > Platforms > Web Push
2. Choose "Typical Site" setup
3. Enter your site details:
   - **Site Name**: Bible Challenge 2026
   - **Site URL**: https://bethel-bible-2026.web.app
   - **Default Icon URL**: https://bethel-bible-2026.web.app/logo192.png
4. Click "Save"

## Step 3: Get Your App ID

1. In OneSignal dashboard, go to Settings > Keys & IDs
2. Copy your **App ID** (looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
3. Also copy the **Safari Web ID** if you want iOS web support

## Step 4: Update the App

Replace `YOUR_ONESIGNAL_APP_ID` in `src/App.js` with your actual App ID from step 3.

```javascript
// Find this line in src/App.js:
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';

// Replace with your actual ID:
const ONESIGNAL_APP_ID = '4aceee22-b1f2-444b-8cae-557d9128bbf8';
```

## Step 5: Deploy and Test

1. Build and deploy:
   ```bash
   npm run build
   firebase deploy --project bethel-bible-2026
   ```

2. Visit your app and set a reminder time
3. Grant notification permissions when prompted
4. Wait for the reminder time - you should get a notification even if the app is closed!

## Step 6: Schedule Automated Reminders (Optional)

OneSignal can send automated reminders based on user's timezone:

1. In OneSignal dashboard, go to "Messages" > "New Push"
2. Select "Automated Message"
3. Set trigger: "Tag Change" when `reminderTime` exists
4. Schedule based on user's local time using the `reminderTime` tag
5. Message: "Time to read today's Bible chapters! 📖"

## Features

- ✅ Works when app is closed
- ✅ Works on all browsers (Chrome, Firefox, Edge, Safari on macOS)
- ✅ Android home screen notifications
- ✅ Free for unlimited notifications
- ✅ Handles all the push complexity
- ✅ Analytics dashboard included

## Limitations

- iOS Safari: Push notifications only work when app is added to home screen as PWA
- Users must grant notification permission
- First notification might take 1-2 minutes to register

## Support

OneSignal documentation: https://documentation.onesignal.com/docs/web-push-quickstart
