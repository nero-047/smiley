import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

const SMILE_QUOTES = [
  "A smile is the best makeup any girl can wear. 💄",
  "Smile, it's free therapy! 😊",
  "Your smile is your logo, your personality is your business card. 💼",
  "Life is better when you're laughing. 😂",
  "A smile is a curve that sets everything straight. ✨",
  "Happiness looks gorgeous on you! 🌟",
  "Keep smiling because life is a beautiful thing. 🌺",
  "Smile and let the world wonder why. 😏",
  "A day without laughter is a day wasted. 🎭",
  "Smiling is my favorite exercise. 💪",
  "The world always looks brighter from behind a smile. 🌅",
  "A smile is the universal welcome. 🤗",
  "Wear a smile and have friends; wear a scowl and have wrinkles. 😤",
  "Peace begins with a smile. ☮️",
  "A smile costs nothing but gives much. 💝",
  "Smile - it's the key that fits the lock of everybody's heart. 💖",
  "Every smile makes you a day younger. 👶",
  "A smile is happiness you'll find right under your nose. 👃",
  "Let your smile change the world, but don't let the world change your smile. 🌍",
  "Smile, breathe, and go slowly. 🧘‍♀️",
];

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return false;
  }

  return true;
}

export async function initializeNotifications() {
  // Set up notification response listener
  Notifications.addNotificationResponseReceivedListener((response) => {
    const quote = response.notification.request.content.body;
    // Navigate to quote display screen
    // This would be handled by deep linking in a real app
    console.log("Notification tapped with quote:", quote);
  });
}

export async function scheduleNotifications(
  startTime: Date,
  endTime: Date,
  frequency: number
) {
  await cancelAllNotifications();

  const now = new Date();

  const startTotalMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endTotalMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  if (endTotalMinutes <= startTotalMinutes || frequency <= 0) {
    console.error("Invalid time range or frequency");
    return;
  }

  const activePeriodMinutes = endTotalMinutes - startTotalMinutes;
  let intervalMinutes = Math.floor(activePeriodMinutes / frequency);
  if (intervalMinutes < 10) intervalMinutes = 10; // Minimum 10 mins apart

  for (let day = 0; day < 7; day++) {
    const baseDate = new Date();
    baseDate.setDate(now.getDate() + day);
    baseDate.setHours(0, 0, 0, 0); // start of the day

    for (let i = 0; i < frequency; i++) {
      const totalMinutes = startTotalMinutes + i * intervalMinutes;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;

      const notificationTime = new Date(baseDate);
      notificationTime.setHours(hour, minute, 0, 0);

      if (notificationTime <= now) continue;

      const quote = getRandomQuote();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "😊 Smile Reminder",
          body: quote,
          sound: "default",
          data: { quote },
        },
        trigger: notificationTime, // ✅ FIXED
      });

      console.log("Scheduled at:", notificationTime.toString());
    }
  }

  console.log(`✅ Scheduled ${frequency} notifications/day for 7 days.`);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All notifications cancelled");
}

export function getRandomQuote(): string {
  return SMILE_QUOTES[Math.floor(Math.random() * SMILE_QUOTES.length)];
}
