# How to Send Push Notifications to All Users

## Method 1: Use OneSignal Dashboard (EASIEST - Recommended for Now)

1. Go to https://onesignal.com and log in
2. Select your app: **Bible Challenge 2026**
3. Click **Messages** in the left sidebar
4. Click **New Push** button
5. Under **Audience**, select **Send to All Subscribers**
6. Fill in:
   - **Title**: Bible Challenge 2026 📖
   - **Message**: The app is back! 🎉 All your reading progress is safe and ready.
7. Click **Review & Send** → **Send Message**

That's it! All users will receive the notification instantly.

---

## Method 2: Use the App's Admin Panel (After Setup)

### Step 1: Get Your OneSignal REST API Key

1. Go to https://onesignal.com
2. Select your app
3. Go to **Settings** → **Keys & IDs**
4. Copy the **REST API Key** (starts with something like `ZGY4ZmE...`)

### Step 2: Add the REST API Key to Your App

Edit `src/App.js` and find this line (around line 1915):
```javascript
'Authorization': 'Basic YOUR_REST_API_KEY_HERE'
```

Replace `YOUR_REST_API_KEY_HERE` with your actual REST API key:
```javascript
'Authorization': 'Basic ZGY4ZmE1ZDctNTNmNi00YWYzLWIwZDktYjE2MzA5OTM4ZGUx'
```

### Step 3: Rebuild and Deploy

```bash
npm run build
firebase deploy --only hosting
```

### Step 4: Send Notification from App

1. Open your app
2. Go to **Profile**
3. Scroll down to the Admin Tools section
4. Type your message in the textarea
5. Click **"Send Push Notification to All"** button

---

## Current Users Registered with OneSignal

All users who have logged into the app since OneSignal was integrated are automatically registered. When they log in, this code runs:

```javascript
await OneSignal.login(currentUser);
```

This associates their device with their username in OneSignal, so they'll receive all notifications.

---

## Suggested Message to Send

**Title**: Bible Challenge 2026 📖

**Message**: Great news! The app is back online. All your reading progress is safe and ready. Let's continue our journey together! 🎉

---

## For Right Now (Immediate Solution):

Just use **Method 1** from the OneSignal dashboard - it's the quickest and doesn't require any code changes!
