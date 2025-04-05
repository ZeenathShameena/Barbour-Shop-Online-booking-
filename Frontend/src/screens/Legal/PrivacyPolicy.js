import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';

const PrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('TermsAndConditions')}
        >
          <Text style={styles.navButtonText}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect personal information that you provide to us, including name, email address, phone number
             and location data. We also collect information about your use of the App and your 
            booking history.
          </Text>
          
          <Text style={styles.subTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to provide our services, manage appointment bookings, send notifications about 
            appointments, improve our App, communicate with you, and ensure the security of our services.
          </Text>
          
          <Text style={styles.subTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We share your information with barbers you book appointments with. We may also share information 
            with service providers who help us operate our business, and when required by law.
          </Text>
          
          <Text style={styles.subTitle}>4. Appointment Reminders</Text>
          <Text style={styles.paragraph}>
            We may send you reminders about upcoming appointments via push notifications, SMS, or email. 
            You can adjust your notification preferences within the App settings.
          </Text>
          
          <Text style={styles.subTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information. However, no method 
            of transmission over the Internet is 100% secure.
          </Text>
          
          <Text style={styles.subTitle}>6. Your Choices</Text>
          <Text style={styles.paragraph}>
            You can access, update, or delete your account information through the App. You can also opt-out of 
            marketing communications while still receiving service-related notifications about your bookings.
          </Text>
          
          <Text style={styles.subTitle}>7. Third-Party Links</Text>
          <Text style={styles.paragraph}>
            Our App may contain links to third-party websites or services. We are not responsible for the 
            privacy practices of these third parties.
          </Text>
          
          <Text style={styles.subTitle}>8. Changes to Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page.
          </Text>
          
          <Text style={styles.subTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].
          </Text>
          
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 20,
    color: '#0066CC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  navButton: {
    padding: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 6,
  },
  navButtonText: {
    color: '#0066CC',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888888',
    marginTop: 24,
    textAlign: 'center',
  },
});

export default PrivacyScreen;