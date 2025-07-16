import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // Existing styles from your original implementation
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
   
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5
  },
  editButton: {
    padding: 10
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 25
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4A90E2'
  },
  
  // New sections styles
  sectionContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5
  },
  
  // Existing info container styles
  infoContainer: {
    marginBottom: 25,
    alignItems: 'flex-start'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 10,
    width: '100%'
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500'
  },

  // Preferences styles
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10
  },

  // Legal section styles
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  legalText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10
  },

  // Logout button styles
  logoutButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  logoutIcon: {
    marginRight: 10
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center'
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%'
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333'
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15
  },
  updateButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 15
  },
  cancelButton: {
    marginTop: 10,
    padding: 10
  },
  cancelButtonText: {
    color: '#4A90E2',
    fontSize: 16
  },
  buttonIcon: {
    marginRight: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});