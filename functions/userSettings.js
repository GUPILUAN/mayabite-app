import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocation } from "../slices/locationSlice";
import * as Location from "expo-location";

export const saveSettingsToStorage = async (settings, colorScheme) => {
  try {
    console.log(settings);
    const updatedSettings = {
      ...settings,
      isSwitchOn: colorScheme !== "dark",
    };
    const jsonSettings = JSON.stringify(updatedSettings);
    await AsyncStorage.setItem("userSettings", jsonSettings);
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

const AREA_CENTER = { latitude: 21.11113, longitude: -89.61231 };
const AREA_RADIUS = 500;

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const checkIfInsideArea = (coords, coordsB) => {
  const pointA = { latitude: coords.latitude, longitude: coords.longitude };
  const pointB = {
    latitude: coordsB ? coordsB.latitude : AREA_CENTER.latitude,
    longitude: coordsB ? coordsB.longitude : AREA_CENTER.longitude,
  };

  const distance = getDistanceFromLatLonInMeters(
    pointA.latitude,
    pointA.longitude,

    pointB.latitude,
    pointB.longitude
  );

  return distance <= (coordsB ? 50 : AREA_RADIUS);
};

export const getLocation = async (dispatch) => {
  try {
    const locationX = await Location.getCurrentPositionAsync({});

    dispatch(setLocation(locationX.coords));
  } catch (error) {
    console.log("NOPE");
  }
};
