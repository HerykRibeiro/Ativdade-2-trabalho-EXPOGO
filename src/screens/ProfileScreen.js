import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen({ user, onLogout }) {
  const email = user ? user.email : 'emily.johnson@x.dummyjson.com';
  const firstName = user ? user.firstName : 'Emily';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Perfil de {firstName}</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b121f',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#0b121f',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  email: {
    fontSize: 16,
    color: '#52657a',
    textAlign: 'center',
    fontWeight: '400',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: 'rgba(255, 74, 74, 0.1)',
    borderColor: 'rgba(255, 74, 74, 0.3)',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

