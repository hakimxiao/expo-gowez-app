import EmptyRecentRidesList from "@/components/home/EmptyRecentRidesList";
import FlatListHeader from "@/components/home/FlatListHeader";
import RideCard from "@/components/home/RideCard";
import { recentRides } from "@/constants";
import { useUser } from "@clerk/expo";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useUser();
  const loading = false;

  const handleSignOut = () => {};

  const handleDestinationPress = () => {};

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
