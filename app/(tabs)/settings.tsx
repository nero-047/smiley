import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotifications, cancelAllNotifications } from '@/services/notificationService';

interface Settings {
  startTime: Date;
  endTime: Date;
  frequency: number;
  notificationsEnabled: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(21, 0, 0, 0)),
    frequency: 5,
    notificationsEnabled: true,
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...parsed,
          startTime: new Date(parsed.startTime),
          endTime: new Date(parsed.endTime),
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
      setSettings(newSettings);

      if (newSettings.notificationsEnabled) {
        await cancelAllNotifications();
        await scheduleNotifications(
          newSettings.startTime,
          newSettings.endTime,
          newSettings.frequency
        );
      } else {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const newSettings = { ...settings, startTime: selectedDate };
      saveSettings(newSettings);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const newSettings = { ...settings, endTime: selectedDate };
      saveSettings(newSettings);
    }
  };

  const handleFrequencyChange = (value: number) => {
    const newSettings = { ...settings, frequency: Math.round(value) };
    saveSettings(newSettings);
  };

  const handleNotificationsToggle = (value: boolean) => {
    const newSettings = { ...settings, notificationsEnabled: value };
    saveSettings(newSettings);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings ⚙️</Text>
        <Text style={styles.subtitle}>Customize your smile reminders</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Get smile reminders throughout the day
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#ccc', true: '#FFD700' }}
            thumbColor={settings.notificationsEnabled ? '#FF8C00' : '#f4f3f4'}
          />
        </View>

        {settings.notificationsEnabled && (
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Start Time</Text>
                <Text style={styles.settingDescription}>
                  When to start sending reminders
                </Text>
              </View>
              <Pressable
                style={styles.timeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(settings.startTime)}
                </Text>
              </Pressable>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>End Time</Text>
                <Text style={styles.settingDescription}>
                  When to stop sending reminders
                </Text>
              </View>
              <Pressable
                style={styles.timeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(settings.endTime)}
                </Text>
              </Pressable>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>
                  Reminders per day: {settings.frequency}
                </Text>
                <Text style={styles.settingDescription}>
                  How many smile reminders you'll receive
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={20}
                  value={settings.frequency}
                  onValueChange={handleFrequencyChange}
                  minimumTrackTintColor="#FFD700"
                  maximumTrackTintColor="#ddd"
                  step={1}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1</Text>
                  <Text style={styles.sliderLabel}>20</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={settings.startTime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={settings.endTime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  timeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sliderContainer: {
    width: 150,
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
    fontSize: 12,
    color: '#666',
  },
});