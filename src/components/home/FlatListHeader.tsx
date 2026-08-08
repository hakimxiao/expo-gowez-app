import { icons } from "@/constants";
import type { UserResource } from "@clerk/expo/types";
import { Image, Text, TouchableOpacity, View } from "react-native";
import GoogleTextInput from "./GoogleTextInput";

const FlatListHeader = ({
  user,
  handleSignOut,
  handleDestinationPress,
}: {
  user: UserResource | null | undefined;
  handleSignOut: () => void;
  handleDestinationPress: () => void;
}) => {
  return (
    <>
      <View className="flex flex-row items-center justify-between my-5">
        <Text className="text-xl font-JakartaExtraBold">
          Welcome{", "}
          {user?.firstName ||
            user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
          👋
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="justify-center items-center size-10 rounded-full bg-white"
        >
          <Image source={icons.out} className="size-4" />
        </TouchableOpacity>
      </View>

      <GoogleTextInput
        icon={icons.search}
        containerStyle="bg-white shadow-md shadow-neutral-300"
        handlePress={handleDestinationPress}
      />

      <>
        <Text className="text-xl font-JakartaBold mt-5 mb-3">
          Your current location
        </Text>
        <View className="flex flex-row items-center bg-transparent h-[300px]"></View>
      </>
    </>
  );
};

export default FlatListHeader;
