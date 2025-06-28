import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function HistoryScreen() {
  //const runs = useSelector((state) => state.history.runs);
  const { runs, loading, error } = useSelector((state) => state.history);

  const renderItem = ({ item }) => {
    const date = new Date(item.startTime).toLocaleString();
    const duration = `${Math.floor(item.duration / 60)}m ${item.duration % 60}s`;
    const distance = item.distance.toFixed(2);
    const speed = item.averageSpeed.toFixed(2);

    return (
      <View style={styles.item}>
        {loading && <Text>⏳ Ładowanie danych...</Text>}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <Text style={styles.date}>{date}</Text>
        <Text>Dystans: {distance} km</Text>
        <Text>Czas: {duration}</Text>
        <Text>Średnia prędkość: {speed} km/h</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia biegów</Text>
      {runs.length === 0 ? (
        <Text style={styles.empty}>Brak zapisanych biegów.</Text>
      ) : (
        <FlatList
          data={runs.slice().reverse()} // nowe biegi na górze
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  empty: {
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
