import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Icons for styling

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // In the future, this will clear Zustand and SecureStore. 
    // For now, it just routes back to the Onboarding screen.
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>My Profile</Text>
        <Text style={styles.subtext}>Google info and Developer details go here.</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Feather name="log-out" size={20} color="#EF4444" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'space-between', // Pushes content up, button down
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtext: {
    marginTop: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2', // Very light red background
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5', // Soft red border
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#EF4444', // Solid red text
    fontSize: 16,
    fontWeight: 'bold',
  },
});