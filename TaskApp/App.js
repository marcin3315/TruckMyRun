import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Stats: StatsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

function HomeScreen() {
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  

  const addTask = () => {
    if (text.trim() !== '') {
      setTasks([...tasks, { id: Date.now().toString(), title: text , done: false}]);
      setText('');
    }
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const markDone = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const filterTasks = () => {
    if (filter === 'done') return tasks.filter(task => task.done);
    if (filter === 'undone') return tasks.filter(task => !task.done);
    return tasks;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => markDone(item.id)} onLongPress={() => deleteTask(item.id)}>
      <Text style={[styles.task, item.done && styles.done]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button title="Wszystkie" onPress={() => setFilter('all')} />
        <Button title="Wykonane" onPress={() => setFilter('done')} />
        <Button title="Niewykonane" onPress={() => setFilter('undone')} />
      </View>
      <Text style={styles.heading}>Moje Zadania</Text>

      <TextInput
        style={styles.input}
        placeholder="Wpisz nowe zadanie"
        value={text}
        onChangeText={setText}
      />

      <Button title="Dodaj zadanie" onPress={addTask} />

      <FlatList
        data={filterTasks()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />

      <Button
        title="Statystyki" onPress={() => navigation.navigate('Stats', tasks)}
      />
    </View>
    
  );
}

function StatsScreen({ route }) {
  const navigation = useNavigation();
  const tasks = route.params;  

  const all = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const undone = all - done;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statystyki</Text>
      <Text style={styles.stat}>Wszystkie zadania: {all}</Text>
      <Text style={styles.stat}>Wykonane: {done}</Text>
      <Text style={styles.stat}>Niewykonane: {undone}</Text>
      <Button title="Powrót" onPress={() => navigation.goBack()} />
       
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  list: {
    marginTop: 20,
  },
  task: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  done: {
    color: '#07a31a',
    textDecorationLine: 'line-through',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    marginBottom: 10,
  },

  
});
