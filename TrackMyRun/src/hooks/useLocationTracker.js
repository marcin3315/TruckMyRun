//hook, który nasłuchuje zmiany pozycji i aktualizuje stan w Reduxie
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { addLocation } from '../redux/runSlice';
import React, { useEffect } from 'react';

export default function useLocationTracker(isTracking) {
  const dispatch = useDispatch();

  useEffect(() => {
    let subscriber = null;
    //useEffect uruchamia się za każdym razem, gdy zmieni się isTracking lub dispatch.
    //subscriber to odniesienie do aktywnego nasłuchiwania lokalizacji

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Brak zgody na lokalizację');
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // co 1 sekunda
          distanceInterval: 5, // lub co 5 metrów
        },
        (location) => {
          const { latitude, longitude, timestamp } = location.coords;
          dispatch(addLocation({ latitude, longitude, timestamp }));
        }
      );
    };

    if (isTracking) {
      startTracking();
    }

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [isTracking, dispatch]);
}
