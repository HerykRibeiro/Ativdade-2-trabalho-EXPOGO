import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, Button } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [texto, setTexto] = useState('');

  function testeExecutarBtn(){
    Alert.alert('Botão clicado');
  }

  return (
    <View style={styles.container}>
      <Text>Titulo</Text>
      <StatusBar style="auto" />
      <View>
        <Text>Tarefas</Text>
        <TextInput onChangeText={setTexto} value={texto}/>
        <Text>Valor</Text>
        <TouchableOpacity onPress={testeExecutarBtn}>
          <Text>Clique aqui</Text>
        </TouchableOpacity>
        <Button title='Clique aqui' onPress={testeExecutarBtn} />
        <Image source={require('./assets/ToDoIcon.png')} style={{width: 50, height: 50}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caddca',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


