import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermissions, initializeNotifications } from '@/services/notificationService';

export default function HomeScreen() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
    setupNotifications();
    startPulseAnimation();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(onboarded === 'true');
      
      if (!onboarded) {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const setupNotifications = async () => {
    await requestNotificationPermissions();
    await initializeNotifications();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSmileyPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (hasOnboarded === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>😊</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smile Reminder</Text>
        <Text style={styles.subtitle}>Keep spreading joy! 🌟</Text>
      </View>
      
      <View style={styles.centerContent}>
        <Pressable onPress={handleSmileyPress}>
          <Animated.Text 
            style={[styles.smiley, { transform: [{ scale: scaleAnim }] }]}
          >
            😊
          </Animated.Text>
        </Pressable>
        <Text style={styles.tagline}>Tap me for a smile boost!</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Notifications will remind you to smile throughout the day
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
  },
  loadingText: {
    fontSize: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    fontSize: 120,
    textAlign: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});