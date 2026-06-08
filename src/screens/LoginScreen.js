import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { loginUser } from '../services/api';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Por favor, preencha o usuário e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginUser(username, password);
      onLogin(userData);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message || 'Usuário ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/new_logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.appName}>
              My<Text style={styles.appNameHighlight}>Currency</Text>
            </Text>
          </View>

          <View style={styles.formContainer}>
            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Usuário"
                placeholderTextColor="#697d95"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Senha"
                placeholderTextColor="#697d95"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#697d95"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => alert('Contate o administrador para obter suas credenciais.')}
            >
              <Text style={styles.linkText}>Esqueci a Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkBtn, { marginTop: 15 }]}
              onPress={() => alert('Opção de cadastro indisponível no momento.')}
            >
              <Text style={styles.linkText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010f1a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoImage: {
    width: 140,
    height: 181,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a2b0c2',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  appNameHighlight: {
    color: '#3b82f6',
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: '#ff4a4a',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101e2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    height: 54,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkBtn: {
    alignSelf: 'center',
    padding: 5,
    marginTop: 10,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '500',
  },
});
