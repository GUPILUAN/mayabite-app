export default {
  expo: {
    name: "Mayabite",
    slug: "mayabite-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.jpg",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#00000",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gupiluan.mayabite",
      infoPlist: {
        NSCameraUsageDescription:
          "We need access to your camera to take pictures.",
        NSPhotoLibraryUsageDescription:
          "We need access to your photo library to save pictures.",
        NSLocationWhenInUseUsageDescription: "We need access to your location",
        NSFaceIDUsageDescription: "We need to access to your FaceID",
      },
      config: {
        googleMapsApiKey: "YOUR_API_KEY",
      },
    },
    android: {
      package: "com.gupiluan.mayabite",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "34fb4533-3ae0-4783-8375-68051ed32fbf",
      },
    },
    owner: "luisgtz15",
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            newArchEnabled: false,
          },
          ios: {
            newArchEnabled: false,
          },
        },
      ],
      [
        "expo-secure-store",
        {
          faceIDPermission:
            "Allow Mayabite to access your Face ID biometric data.",
        },
      ],
    ],
  },
};
