const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

if (!googleMapsApiKey) {
  throw new Error("EXPO_PUBLIC_GOOGLE_API_KEY is required to build Google Maps.");
}

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: googleMapsApiKey,
      },
    ],
  ],
});
