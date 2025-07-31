import { View, Text, StyleSheet, Image, Pressable, Linking, ScrollView } from 'react-native';
import { Mail, Github, Linkedin, Heart } from 'lucide-react-native';

export default function AboutScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:rishigurung47@gmail.com');
  };

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/nero-047');
  };

  const handleLinkedinPress = () => {
    Linking.openURL('https://linkedin.com/in/developer');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Me 👨‍💻</Text>
        <Text style={styles.subtitle}>Meet the creator behind Smile Reminder</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>😊</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Full Stack Developer & Happiness Enthusiast</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={styles.description}>
          Smile Reminder was born from a simple belief: a smile can change your entire day. 
          In our busy lives, we often forget to take a moment to appreciate the good things 
          around us. This app serves as your gentle companion, reminding you to pause, 
          smile, and spread a little joy.
        </Text>
        <Text style={styles.description}>
          Every notification contains an inspiring quote to lift your spirits and brighten 
          your day. Remember, happiness is contagious - when you smile, you make the world 
          a little brighter! ✨
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Me</Text>
        <View style={styles.contactButtons}>
          <Pressable style={styles.contactButton} onPress={handleEmailPress}>
            <Mail size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Email</Text>
          </Pressable>
          
          <Pressable style={styles.contactButton} onPress={handleGithubPress}>
            <Github size={20} color="#fff" />
            <Text style={styles.contactButtonText}>GitHub</Text>
          </Pressable>
          
          <Pressable style={styles.contactButton} onPress={handleLinkedinPress}>
            <Linkedin size={20} color="#fff" />
            <Text style={styles.contactButtonText}>LinkedIn</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Built with:</Text>
          <Text style={styles.infoValue}>React Native & Expo</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Release Date:</Text>
          <Text style={styles.infoValue}>January 2025</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Heart size={16} color="#FF8C00" />
        <Text style={styles.footerText}>Made with love to spread smiles</Text>
        <Heart size={16} color="#FF8C00" />
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  role: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    color: '#FF8C00',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});