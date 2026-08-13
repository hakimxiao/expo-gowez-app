import EmptyRecentRidesList from "@/components/home/EmptyRecentRidesList";
import FlatListHeader from "@/components/home/FlatListHeader";
import RideCard from "@/components/home/RideCard";
import { recentRides } from "@/constants";
import { useLocationStore } from "@/store";
import { useUser } from "@clerk/expo";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const { user } = useUser();
  const loading = false;

  const [hasPermisssion, setHasPermisssion] = useState(false);

  const handleSignOut = () => {};

  const handleDestinationPress = () => {};

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermisssion(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    requestLocation();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => <EmptyRecentRidesList isLoading={true} />}
        ListHeaderComponent={() => (
          <FlatListHeader
            user={user}
            handleSignOut={handleSignOut}
            handleDestinationPress={handleDestinationPress}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
