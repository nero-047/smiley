import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermissions, scheduleNotifications } from '@/services/notificationService';

export default function OnboardingScreen() {
  const [startTime, setStartTime] = useState(new Date(new Date().setHours(9, 0, 0, 0)));
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(21, 0, 0, 0)));
  const [frequency, setFrequency] = useState(5);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Smile Reminder! 😊",
      subtitle: "Let's set up your daily dose of happiness",
      content: "intro"
    },
    {
      title: "Choose Your Active Hours ⏰",
      subtitle: "When should we send you smile reminders?",
      content: "time"
    },
    {
      title: "Set Your Frequency 📱",
      subtitle: "How many reminders per day?",
      content: "frequency"
    },
    {
      title: "You're All Set! 🎉",
      subtitle: "Ready to start spreading smiles?",
      content: "finish"
    }
  ];

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndTime(selectedDate);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      // Request notification permissions
      const permissionGranted = await requestNotificationPermissions();
      
      if (!permissionGranted) {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications to receive smile reminders.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Save settings
      const settings = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        frequency,
        notificationsEnabled: true,
      };
      
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
      await AsyncStorage.setItem('hasOnboarded', 'true');

      // Schedule notifications
      await scheduleNotifications(startTime, endTime, frequency);

      Alert.alert(
        'Welcome aboard! 🎉',
        'Your smile reminders are now set up. Get ready to brighten your days!',
        [
          {
            text: 'Start Smiling!',
            onPress: () => router.replace('/(tabs)'),
          }
        ]
      );
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.content) {
      case 'intro':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.emoji}>😊</Text>
            <Text style={styles.description}>
              This app will send you gentle reminders throughout the day to smile 
              and share positive quotes to brighten your mood.
            </Text>
            <Text style={styles.description}>
              Let's customize your experience to fit your schedule perfectly!
            </Text>
          </View>
        );
        
      case 'time':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.emoji}>⏰</Text>
            
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <Pressable 
                style={styles.timeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(startTime)}
                </Text>
              </Pressable>
            </View>
            
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>End Time</Text>
              <Pressable 
                style={styles.timeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(endTime)}
                </Text>
              </Pressable>
            </View>
            
            <Text style={styles.description}>
              We'll only send reminders during these hours
            </Text>
          </View>
        );
        
      case 'frequency':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.emoji}>📱</Text>
            <Text style={styles.frequencyText}>
              {frequency} reminder{frequency !== 1 ? 's' : ''} per day
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                value={frequency}
                onValueChange={(value) => setFrequency(Math.round(value))}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#ddd"
                step={1}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1</Text>
                <Text style={styles.sliderLabel}>20</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Find the perfect balance for your lifestyle
            </Text>
          </View>
        );
        
      case 'finish':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.summaryTitle}>Your Settings:</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryItem}>
                ⏰ Active hours: {formatTime(startTime)} - {formatTime(endTime)}
              </Text>
              <Text style={styles.summaryItem}>
                📱 {frequency} reminder{frequency !== 1 ? 's' : ''} per day
              </Text>
            </View>
            <Text style={styles.description}>
              You can always change these settings later in the Settings tab.
            </Text>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      <View style={styles.buttons}>
        {currentStep > 0 && (
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={handlePrevious}>
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </Pressable>
        )}
        
        <Pressable 
          style={[styles.button, styles.primaryButton]} 
          onPress={currentStep === steps.length - 1 ? handleFinish : handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === steps.length - 1 ? 'Start Smiling!' : 'Next'}
          </Text>
        </Pressable>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  timeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  frequencyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 30,
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});