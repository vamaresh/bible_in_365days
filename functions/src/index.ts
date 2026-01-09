import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

const ONESIGNAL_APP_ID = "4aceee22-b1f2-444b-8cae-557d9128bbf8";

/**
 * Scheduled function that runs every minute to check for users
 * who need reminders
 */
export const sendDailyReminders = functions.scheduler.onSchedule({
  schedule: "every 1 minutes",
  timeZone: "UTC",
  secrets: ["ONESIGNAL_REST_API_KEY"],
}, async () => {
  logger.info("Checking for users needing reminders");

  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!apiKey) {
    logger.error("ONESIGNAL_REST_API_KEY not configured");
    return;
  }

  try {
    // Get all users from Realtime Database
    const usersSnapshot =
      await admin.database().ref("users").once("value");
    const users = usersSnapshot.val();

    if (!users) {
      logger.info("No users found");
      return;
    }

    const now = new Date();
    const currentMinute = now.getUTCMinutes();
    const currentHour = now.getUTCHours();

    // Get start date for day calculation
    const START_DATE = new Date("2025-01-06T00:00:00Z");
    const today =
      new Date(now.toISOString().split("T")[0] + "T00:00:00Z");
    const dayNumber = Math.floor(
      (today.getTime() - START_DATE.getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1;

    const notificationsToSend = [];

    // Check each user
    for (const userId of Object.keys(users)) {
      const user = users[userId];
      const reminderTime = user.reminderTime; // Format: "HH:MM"

      if (!reminderTime) continue;

      // Parse reminder time
      const [reminderHour, reminderMinute] =
        reminderTime.split(":").map(Number);

      // Get user's timezone offset (minutes, negative for ahead of UTC)
      const tzOffsetMinutes = user.tzOffsetMinutes || 0;

      // Calculate user's local time
      const userLocalHour =
        (currentHour * 60 + currentMinute + tzOffsetMinutes) / 60;
      const userLocalMinute =
        ((currentHour * 60 + currentMinute + tzOffsetMinutes) %
        60 + 60) % 60;
      const userHour = Math.floor(userLocalHour) % 24;

      // Check if it's time to send reminder (matching hour and minute)
      if (userHour === reminderHour &&
          Math.floor(userLocalMinute) === reminderMinute) {
        // Check if user has already completed today's reading
        const todayDate = today.toISOString().split("T")[0];
        const completedDates = user.completedDates || [];
        const hasCompleted = completedDates.includes(todayDate);

        if (!hasCompleted) {
          notificationsToSend.push({
            userId,
            dayNumber,
          });
        }
      }
    }

    // Send notifications via OneSignal API
    if (notificationsToSend.length > 0) {
      logger.info(`Sending ${notificationsToSend.length} reminders`);

      for (const {userId} of notificationsToSend) {
        try {
          await sendOneSignalNotification(
            userId,
            "Bible Challenge 2026",
            `${userId}, Time to read Holy Bible 📖`,
            apiKey
          );
          logger.info(`Sent reminder to user: ${userId}`);
        } catch (error) {
          logger.error(
            `Failed to send notification to ${userId}:`,
            error
          );
        }
      }
    } else {
      logger.info("No reminders to send at this time");
    }
  } catch (error) {
    logger.error("Error in sendDailyReminders:", error);
  }
});

/**
 * Helper function to send notification via OneSignal API
 * @param {string} externalUserId - User ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} apiKey - OneSignal REST API key
 * @return {Promise} Response from OneSignal API
 */
async function sendOneSignalNotification(
  externalUserId: string,
  title: string,
  message: string,
  apiKey: string
) {
  const response = await fetch(
    "https://onesignal.com/api/v1/notifications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: [externalUserId],
        headings: {en: title},
        contents: {en: message},
        web_url: "https://bethel-bible-2026.web.app",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OneSignal API error: ${error}`);
  }

  return response.json();
}

/**
 * HTTP function to manually trigger reminder check (for testing)
 */
export const testReminders = functions.https.onRequest(
  async (req, res) => {
    logger.info("Manual reminder test triggered");
    res.json({success: true, message: "Check function logs for results"});
  }
);
