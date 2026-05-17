import { useState } from 'react';

import {
  LogBox,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'react-native-emoji-chooser';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Error saving recent emoji',
  'AsyncStorageError',
]);

export default function App() {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoTarefa, setTextoTarefa] = useState('');
  const [categoria, setCategoria] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [emojiAberto, setEmojiAberto] = useState(false);

  const [listaTarefas, setListaTarefas] = useState([
    { id: '1', nome: 'Comprar algo ai', categoria: 'Mercado', emoji: '🛒', feita: false },
    { id: '2', nome: 'fazer algo no fim de semana', categoria: 'Faculdade???', emoji: '📚', feita: false },
    { id: '3', nome: 'Fapenas testando', categoria: 'continuo testando', emoji: '💻', feita: false },
    { id: '4', nome: 'Arrumar o quarto', categoria: 'Pessoal', emoji: '🧹', feita: true },
  ]);

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tarefasPendentes = listaTarefas.filter((item) => !item.feita);
  const tarefasConcluidas = listaTarefas.filter((item) => item.feita);

  function adicionarTarefa() {
    if (textoTarefa.trim() === '') return;

    const novaTarefa = {
      id: Date.now().toString(),
      nome: textoTarefa,
      categoria: categoria || 'Sem categoria',
      emoji,
      feita: false,
    };

    setListaTarefas([...listaTarefas, novaTarefa]);
    setTextoTarefa('');
    setCategoria('');
    setEmoji('📝');
    setEmojiAberto(false);
    setModalVisivel(false);
  }

  function marcarTarefa(id) {
    setListaTarefas(
      listaTarefas.map((item) =>
        item.id === id ? { ...item, feita: !item.feita } : item
      )
    );
  }

  function mostrarTarefa({ item }) {
    return (
      <View style={[styles.card, item.feita && styles.cardFeita]}>
        <Checkbox
  value={item.feita}
  onValueChange={() => marcarTarefa(item.id)}
        />

        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={[styles.nomeTarefa, item.feita && styles.textoRiscado]}>
            {item.emoji} {item.nome}
          </Text>

          {!item.feita && (
            <Text style={styles.categoriaTexto}>{item.categoria}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.data}>{dataAtual}</Text>

      <Text style={styles.subtitulo}>
        {tarefasPendentes.length} pendentes, {tarefasConcluidas.length} concluídas
      </Text>

      <View style={styles.linha} />

      <Text style={styles.tituloSecao}>Incompletas</Text>

      <FlatList
        data={tarefasPendentes}
        keyExtractor={(item) => item.id}
        renderItem={mostrarTarefa}
      />

      <Text style={styles.tituloSecao}>Realizadas</Text>

      <FlatList
        data={tarefasConcluidas}
        keyExtractor={(item) => item.id}
        renderItem={mostrarTarefa}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisivel(true)}>
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisivel} transparent={true} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisivel(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <Text style={styles.modalTitulo}>Nova tarefa</Text>

              <Text style={styles.label}>Tarefa</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite uma tarefa"
                value={textoTarefa}
                onChangeText={setTextoTarefa}
              />

              <View style={styles.row}>
                <View style={styles.emojiArea}>
                  <Text style={styles.label}>Emoji</Text>

                  <TouchableOpacity
                    style={styles.botaoEmoji}
                    onPress={() => setEmojiAberto(!emojiAberto)}
                  >
                    <Text style={styles.emojiTexto}>{emoji}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Categoria</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Faculdade"
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </View>
              </View>

              {emojiAberto && (
                <View style={styles.pickerContainer}>
                  <EmojiPicker
                    onSelect={(emojiSelecionado) => {
                      setEmoji(emojiSelecionado);
                      setEmojiAberto(false);
                    }}
                    columns={7}
                    showSearchBar={false}
                    showTabs={true}
                  />
                </View>
              )}

              <TouchableOpacity style={styles.botaoCriar} onPress={adicionarTarefa}>
                <Text style={styles.textoBotao}>Criar tarefa</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  data: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textTransform: 'capitalize',
  },

  subtitulo: {
    marginTop: 5,
    color: '#8b849b',
    fontSize: 14,
    marginBottom: 15,
    fontWeight: '600',
  },

  linha: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c5470',
    marginBottom: 8,
    marginTop: 8,
  },

  card: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardFeita: {
    opacity: 0.45,
  },

  nomeTarefa: {
    fontSize: 17,
    color: '#5c5470',
    fontWeight: '600',
  },

  textoRiscado: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  categoriaTexto: {
    color: '#8b849b',
    marginTop: 3,
    fontSize: 13,
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6a00d4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#333',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5c5470',
  },

  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  emojiArea: {
    width: 80,
  },

  botaoEmoji: {
    height: 45,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  emojiTexto: {
    fontSize: 22,
  },

  pickerContainer: {
    height: 230,
    flexShrink: 1,
    marginBottom: 10,
  },

  botaoCriar: {
    backgroundColor: '#6a00d4',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});