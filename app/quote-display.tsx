import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Clipboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Copy, ArrowLeft, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const FUNNY_VIDEOS = [
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/ZZ5LpwO-An4',
  'https://www.youtube.com/embed/L_jWHffIx5E',
  'https://www.youtube.com/embed/fC7oUOUEEi4',
  'https://www.youtube.com/embed/Ct6BUPvE2sM',
];

export default function QuoteDisplayScreen() {
  const { quote } = useLocalSearchParams<{ quote: string }>();
  const [showWarning, setShowWarning] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  useEffect(() => {
    // Select a random video when component mounts
    const randomVideo = FUNNY_VIDEOS[Math.floor(Math.random() * FUNNY_VIDEOS.length)];
    setSelectedVideoUrl(randomVideo);
  }, []);

  const handleCopy = async () => {
    try {
      // Instead of copying the actual quote, copy this instead
      const fakeCopyText = "bitch i told not to copy!";
      await Clipboard.setString(fakeCopyText);
      setShowWarning(true);
      
      // Vibrate if available (not available on web)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleTextSelection = () => {
    // This will be triggered when user tries to select text
    handleCopy();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FF8C00" />
        </Pressable>
        <Text style={styles.headerTitle}>Your Smile Quote 😊</Text>
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quoteIcon}>💭</Text>
        <Pressable onLongPress={handleTextSelection}>
          <Text 
            style={styles.quote}
            selectable={true}
          >
            {quote || "Keep smiling, you're amazing! 😊"}
          </Text>
        </Pressable>
        
        <Pressable style={styles.copyButton} onPress={handleCopy}>
          <Copy size={20} color="#fff" />
          <Text style={styles.copyButtonText}>Copy Quote</Text>
        </Pressable>
      </View>

      {showWarning && (
        <View style={styles.warningContainer}>
          <AlertTriangle size={24} color="#FF6B6B" />
          <Text style={styles.warningText}>⚠️ Don't copy the damn quote!</Text>
        </View>
      )}

      <View style={styles.videoSection}>
        <Text style={styles.videoTitle}>Here's something funny to brighten your day! 🎬</Text>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: selectedVideoUrl }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerEmoji}>😊</Text>
        <Text style={styles.footerText}>
          Remember, every smile makes the world a little brighter!
        </Text>
        <Pressable 
          style={styles.homeButton} 
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    flex: 1,
  },
  quoteContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  quoteIcon: {
    fontSize: 40,
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 25,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  warningText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
    flex: 1,
  },
  videoSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 15,
  },
  videoContainer: {
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});