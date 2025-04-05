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

const TermsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={styles.navButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to [Your Barber App Name]. By downloading, accessing, or using our mobile application, 
            you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
            you may not access the App.
          </Text>
          
          <Text style={styles.subTitle}>2. User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account with us, you must provide accurate and complete information. 
            You are responsible for safeguarding the password you use to access the App and for any activities 
            or actions under your password.
          </Text>
          
          <Text style={styles.subTitle}>3. Booking Services</Text>
          <Text style={styles.paragraph}>
            Our App allows you to book appointment slots with barbers. We are not responsible for the quality of 
            services provided by barbers. Cancellation policies are set by individual barbers and should be 
            respected by users.
          </Text>
          
          <Text style={styles.subTitle}>4. Appointment Bookings</Text>
          <Text style={styles.paragraph}>
            When booking a slot through our App, you agree to arrive at the scheduled time. If you need to cancel 
            or reschedule, please do so at least 24 hours in advance. No-shows or late cancellations may result 
            in restrictions on future bookings.
          </Text>
          
          <Text style={styles.subTitle}>5. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages resulting from your use or inability to use the App.
            We do not guarantee the availability of specific time slots or barbers.
          </Text>
          
          <Text style={styles.subTitle}>6. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. We will provide notice of any significant 
            changes. Your continued use of the App after such modifications constitutes your acceptance of the 
            revised terms.
          </Text>
          
          <Text style={styles.subTitle}>7. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by the laws of [Your Jurisdiction], without regard to its conflict of 
            law provisions.
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

export default TermsScreen;