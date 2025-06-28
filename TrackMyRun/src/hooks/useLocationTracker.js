import { useEffect } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "../redux/runSlice";

export default function useLocationTracker(isTracking) {
  const dispatch = useDispatch();
  const isPaused = useSelector((state) => state.run.isPaused);

  useEffect(() => {
    let subscriber = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Brak zgody na lokalizację");
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // co 1 sekunda
          distanceInterval: 5, // lub co 5 metrów
        },
        (location) => {
          if (!isPaused) {
            const { latitude, longitude, timestamp } = location.coords;
            dispatch(addLocation({ latitude, longitude, timestamp }));
          }
        },
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
