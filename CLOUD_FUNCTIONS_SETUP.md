# Cloud Functions Setup Guide

This guide explains how to deploy the Cloud Functions that send personalized reminders via OneSignal.

## ✅ What's Been Done

1. **App Updated**: OneSignal subscription prompt now shows when users set their reminder time
2. **Cloud Functions Code**: Written to check every minute and send reminders at each user's exact time
3. **Timezone Support**: User's timezone is saved and used to calculate their local time

## 🔧 Setup Steps

### Step 1: Upgrade to Firebase Blaze Plan

Cloud Functions require the Blaze (pay-as-you-go) plan.

1. Go to [Firebase Console](https://console.firebase.google.com/project/bethel-bible-2026/usage/details)
2. Click **"Upgrade"** or **"Modify plan"**
3. Select **"Blaze Plan"**
4. Add a billing account (requires credit card)

**Cost estimate**: With your usage (checking every minute, sending ~10-50 notifications/day):
- **Functions invocations**: ~43,000/month (well under 2M free tier)
- **Outbound networking**: Minimal (API calls to OneSignal)
- **Expected monthly cost**: $0-2 USD

### Step 2: Get OneSignal REST API Key

1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Open your **Bible Challenge 2026** app
3. Click **Settings** in the left sidebar
4. Click **Keys & IDs**
5. Copy the **REST API Key** (starts with something like `YzQyNGE...`)

### Step 3: Configure the Secret in Firebase

Run this command in your terminal (replace `YOUR_REST_API_KEY` with your actual key):

```bash
firebase functions:secrets:set ONESIGNAL_REST_API_KEY --project bethel-bible-2026
```

When prompted, paste your OneSignal REST API Key.

### Step 4: Deploy Cloud Functions

```bash
firebase deploy --only functions --project bethel-bible-2026
```

### Step 5: Test the Setup

1. Visit https://bethel-bible-2026.web.app
2. Log in
3. Go to Settings
4. Set a reminder time (set it 2-3 minutes in the future for testing)
5. Allow notifications when prompted by OneSignal
6. Close the browser completely
7. Wait for the reminder time
8. You should receive a notification even with the app closed! 🎉

## 🔍 Monitoring

Check if reminders are being sent:

```bash
firebase functions:log --project bethel-bible-2026
```

Look for logs like:
- "Checking for users needing reminders"
- "Sending X reminders"
- "Sent reminder to user: [username]"

## 🛠️ How It Works

1. **Every minute**, the `sendDailyReminders` function runs
2. It reads all users from Firebase Realtime Database
3. For each user, it calculates their **local time** using their timezone offset
4. If it's their **reminder time** and they **haven't completed today's reading**:
   - Sends a notification via OneSignal API to that specific user
   - Marks that a reminder was sent today (prevents duplicates)

## ⚡ Key Features

- ✅ Personalized reminder times per user
- ✅ Works when app is closed
- ✅ Works on all browsers and devices (including iOS PWA)
- ✅ Timezone-aware (sends at user's local time)
- ✅ Prevents duplicate reminders
- ✅ Only sends if user hasn't completed today's reading

## 🚨 Troubleshooting

### No notifications being sent?
- Check function logs: `firebase functions:log --project bethel-bible-2026`
- Verify ONESIGNAL_REST_API_KEY is set correctly
- Check OneSignal dashboard for delivery reports

### Users not subscribed to OneSignal?
- Make sure users click "Allow" when the subscription prompt appears
- Check OneSignal dashboard → Audience → Subscriptions

### Wrong reminder time?
- User's timezone might be incorrect
- Check the `tzOffsetMinutes` value in Firebase Database for that user
- User should re-save their reminder time to update timezone

## 💰 Cost Control

To avoid unexpected charges, set up a budget alert:

1. Go to [Google Cloud Console](https://console.cloud.google.com/billing)
2. Select your billing account
3. Click **Budgets & alerts**
4. Create a budget (e.g., $5/month)
5. Set alert at 50% and 90% threshold

## 📝 Notes

- The in-app notification system still works as a fallback
- Cloud Functions are only needed for notifications when app is closed
- OneSignal handles all the push infrastructure
- The scheduled function runs every minute in UTC timezone
