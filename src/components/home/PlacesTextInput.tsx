import { icons } from "@/constants";
import { PlacesInputProps } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
  };
}

const PlacesTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: PlacesInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Bounding box Sumatera Selatan:
        // Barat Daya: Lat -4.95, Lon 102.0 | Timur Laut: Lat -1.6, Lon 106.1
        // Format viewbox Nominatim: <left>,<top>,<right>,<bottom> -> 102.0,-1.6,106.1,-4.95
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query.trim()
        )}&format=json&addressdetails=1&countrycodes=id&viewbox=102.0,-1.6,106.1,-4.95&bounded=1&limit=7`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "GowezApp/1.0 (contact@gowez.local)",
          },
        });

        const data: NominatimPlace[] = await response.json();
        setResults(data || []);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching OpenStreetMap places:", error);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelectPlace = (place: NominatimPlace) => {
    setQuery(place.display_name);
    setShowResults(false);
    setResults([]);

    if (handlePress) {
      handlePress({
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        address: place.display_name,
      });
    }
  };

  return (
    <View className={`relative z-50 mb-5 ${containerStyle}`}>
      {/* Search Input Bar */}
      <View
        className="flex flex-row items-center px-4 py-3 rounded-full"
        style={{ backgroundColor: textInputBackgroundColor || "white" }}
      >
        <Image
          source={icon ? (typeof icon === "string" ? { uri: icon } : icon) : icons.search}
          className="w-5 h-5 mr-3"
          resizeMode="contain"
        />

        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowResults(true);
          }}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          placeholder={initialLocation ?? "Cari lokasi di Sumatera Selatan..."}
          placeholderTextColor="gray"
          className="flex-1 text-base font-semibold text-neutral-800 p-0"
        />

        {isLoading ? (
          <ActivityIndicator size="small" color="#0286FF" className="ml-2" />
        ) : query.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="p-1"
          >
            <Text className="text-gray-400 font-bold text-sm">✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Autocomplete Recommendation Dropdown */}
      {showResults && results.length > 0 && (
        <View
          className="mt-2 bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden"
          style={{
            maxHeight: 240,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectPlace(item)}
                className="flex-row items-center px-4 py-3 border-b border-neutral-100 active:bg-neutral-50"
              >
                <Image
                  source={icons.point}
                  className="w-4 h-4 mr-3 opacity-60"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-neutral-800"
                    numberOfLines={1}
                  >
                    {item.name || item.display_name.split(",")[0]}
                  </Text>
                  <Text
                    className="text-xs text-neutral-500 mt-0.5"
                    numberOfLines={1}
                  >
                    {item.display_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default PlacesTextInput;
