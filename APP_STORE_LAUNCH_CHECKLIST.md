# App Store Launch Checklist

## Product Readiness

- Test the global annual challenge with existing progress data.
- Test a personal 365-day plan with a custom start date.
- Test creating a reading circle, joining by invite link, and switching between Global annual challenge and My Circle.
- Test encouragement reactions and reflections with multiple users.
- Confirm admin tools are only visible to approved admin users.

## Privacy And Safety

- Rotate the OneSignal REST API key that was previously stored in source code.
- Configure `ONESIGNAL_REST_API_KEY` as a Firebase secret before deploying functions.
- Publish `/privacy.html` and `/support.html`, then replace the support placeholder with a real contact email.
- Review community reflection moderation needs before public launch.
- Confirm account deletion removes user progress as expected.

## iOS Packaging

- Package the web app for iOS with Capacitor or migrate to Expo/React Native.
- Add native app icon, launch screen, bundle ID, version, and build number.
- Configure native push notification entitlement if using push in the App Store version.
- Create TestFlight build and invite church/community testers first.

## App Store Connect

- App name: Bible Reading Challenge.
- Subtitle: Read Scripture Together.
- Category: Lifestyle, Books, or Education.
- Add privacy policy URL: `https://your-domain/privacy.html`.
- Add support URL: `https://your-domain/support.html`.
- Prepare screenshots for Today, Calendar, Community, Reading Circle, Profile, and Notifications.
- Add review notes describing Firebase login by display name, reading circles, notifications, and account deletion.
