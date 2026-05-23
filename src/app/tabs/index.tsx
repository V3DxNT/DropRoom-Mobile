import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';

export default function LobbyScreen() {
  const [roomCode, setRoomCode] = useState<string>('');
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);

  const handleJoinRoom = () => {
    if (roomCode.trim().length > 0) {
      router.push(`/room/${roomCode.trim()}`);
      setRoomCode('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        
        <Text style={styles.greetingText}>
          Welcome back, <Text style={styles.usernameText}>@{user?.username || 'user'}</Text>
        </Text>
        
        <Text style={styles.title}>Where are we dropping?</Text>
        <Text style={styles.subtitle}>
          Enter a room code below to instantly Connect.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. secret-room-42"
          placeholderTextColor="#9CA3AF"
          value={roomCode}
          onChangeText={setRoomCode}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, !roomCode.trim() && styles.buttonDisabled]}
          onPress={handleJoinRoom}
          disabled={!roomCode.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Drop In</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  usernameText: {
    color: '#008080', // Teal accent
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#008080', // Primary Teal
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});