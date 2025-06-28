//dodawanie nowej lokalizacji GPS do stanu aplikacji w Reduxie
//rejestrowanie kolejnych punktów trasy podczas biegu

import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import {
  startRun,
  stopRun,
  resetRun,
  pauseRun,
  resumeRun,
} from "../redux/runSlice";
import useLocationTracker from "../hooks/useLocationTracker";
import { selectDistance } from "../redux/runSlice";
import { addRunAndSave } from "../redux/historySlice";

export default function RunScreen() {
  const dispatch = useDispatch();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [pausedAt, setPausedAt] = useState(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);

  const locations = useSelector((state) => state.run.locations);
  const isRunning = useSelector((state) => state.run.isRunning);
  const isPaused = useSelector((state) => state.run.isPaused);
  const { loading, error } = useSelector((state) => state.history);

  useLocationTracker(isTracking, isPaused);

  useEffect(() => {
    if (isTracking) {
      setStartTime(Date.now());
    }
  }, [isTracking]);

  useEffect(() => {
    let timer = null;

    if (isTracking && !isPaused && startTime) {
      timer = setInterval(() => {
        setDuration(
          Math.floor((Date.now() - startTime - totalPausedTime) / 1000),
        );
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTracking, isPaused, startTime]);

  const handleStart = () => {
    dispatch(startRun());
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
    dispatch(stopRun());

    const endTime = Date.now();
    const timeInSeconds = Math.floor(
      (endTime - startTime - totalPausedTime) / 1000,
    );
    const totalDistance = distance; // w km
    const averageSpeed =
      timeInSeconds > 0 ? totalDistance / (timeInSeconds / 3600) : 0;

    const runData = {
      id: Date.now(),
      startTime,
      endTime,
      duration: timeInSeconds,
      distance: totalDistance,
      averageSpeed,
      route: locations,
    };

    dispatch(addRunAndSave(runData));

    dispatch(resetRun());
  };

  const handleReset = () => {
    dispatch(resetRun());
    setDuration(0);
    setStartTime(null);
  };

  const handlePause = () => {
    setPausedAt(Date.now());
    dispatch(pauseRun());
  };
  const handleResume = () => {
    if (pausedAt) {
      const pauseTime = Date.now() - pausedAt;
      setTotalPausedTime((prev) => prev + pauseTime);
      setPausedAt(null);
    }
    dispatch(resumeRun());
  };

  const currentLocation = locations[locations.length - 1];
  const distance = useSelector(selectDistance); // w km
  const speed = duration > 0 ? (distance / (duration / 3600)).toFixed(2) : "0";

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        region={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : undefined
        }
      >
        {locations.length > 0 && (
          <>
            <Polyline
              coordinates={locations}
              strokeColor="blue"
              strokeWidth={6}
            />
            <Marker coordinate={locations[0]} title="Start" pinColor="red" />
          </>
        )}
      </MapView>

      <View style={styles.stats}>
        <Text>
          Czas: {Math.floor(duration / 60)}m {duration % 60}s
        </Text>
        <Text>Dystans: {distance.toFixed(2)} km</Text>
        <Text>Prędkość: {speed} km/h</Text>
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button title="Stop" onPress={handleStop} />
        )}
        {isRunning && !isPaused && (
          <Button title="⏸️ Pauza" onPress={handlePause} />
        )}

        {isRunning && isPaused && (
          <Button title="▶️ Wznów" onPress={handleResume} />
        )}

        <Button title="Reset" onPress={handleReset} />
        {loading && <Text>⏳ Zapisywanie biegu...</Text>}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 200,
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
  },
  stats: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
  },
});
