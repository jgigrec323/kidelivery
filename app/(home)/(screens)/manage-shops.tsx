import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "@/constants/Colors";
import CustomHeader from "@/components/custom-header";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import config from "@/utils/config";
import { setUser } from "@/store/slices/authSlice"; // Import Redux action
import { Shop } from "@/utils/types"; // Ensure you import the correct Shop type
import { communes } from "@/utils/communesGn";

const StoreScreen = () => {
  const dispatch = useDispatch();
  const { id: userId, shops } = useSelector((state: RootState) => state.auth); // Get user ID and shops from Redux
  const shop: Shop | undefined = shops[0]; // Assuming the user has only one shop

  const [name, setName] = useState(shop?.name || "");
  const [commune, setCommune] = useState(shop?.commune || "");
  const [quartier, setQuartier] = useState(shop?.quartier || "");
  const [address, setAddress] = useState(shop?.address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setCommune(shop.commune);
      setQuartier(shop.quartier);
      setAddress(shop.address);
    }
  }, [shop]);

  // Handle updating the store information
  const handleUpdateStore = async () => {
    if (!name || !commune || !quartier || !address) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${config.API_BASE_URL}/shops/update`,
        {
          id: shop?.id,
          name,
          commune,
          quartier,
          address,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Succès",
          "Informations sur le magasin mises à jour avec succès !"
        );

        // Update the specific shop in the Redux state
        const updatedShops = shops.map((s) =>
          s.id === shop?.id
            ? { ...s, name, commune, quartier, address } // Replace only the updated shop
            : s
        );

        dispatch(
          setUser({
            id: userId || "",
            phoneNumber: shop?.user?.phoneNumber || "",
            fullName: shop?.user?.name || "",
            shops: updatedShops, // Replace the shops array with the updated one
          })
        );
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la mise à jour du magasin."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <CustomHeader h={100} title="Ma boutique" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Ma boutique" />
      <ScrollView className="px-5 mt-5">
        <View className="mb-6">
          <Ionicons name="storefront-outline" size={60} color={COLORS.black} />
          <Text className="text-2xl font-bold mt-4">
            Modifier les informations du magasin
          </Text>
        </View>

        {/* Store Name */}
        <View className="mb-5">
          <Text className="text-lg mb-2">Nom du magasin</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-gray-200 py-3 px-4 rounded-md text-lg"
            placeholder="Entrez le nom du magasin"
          />
        </View>

        {/* Commune Picker */}
        <View className="mb-5">
          <Text className="text-lg mb-2">Commune</Text>
          <Picker
            selectedValue={commune}
            onValueChange={setCommune}
            className="bg-gray-200 py-3 px-4 rounded-md text-lg"
          >
            <Picker.Item label="Sélectionner une commune" value="" />
            {communes.map((commune) => (
              <Picker.Item
                label={commune.name}
                value={commune.name}
                key={commune.name}
              />
            ))}
          </Picker>
        </View>

        {/* Quartier Picker */}
        {commune && (
          <View className="mb-5">
            <Text className="text-lg mb-2">Quartier</Text>
            <Picker
              selectedValue={quartier}
              onValueChange={setQuartier}
              className="bg-gray-200 py-3 px-4 rounded-md text-lg"
            >
              <Picker.Item label="Sélectionner un quartier" value="" />
              {communes
                .find((c) => c.name === commune)
                ?.quartiers.map((quartier) => (
                  <Picker.Item
                    label={quartier}
                    value={quartier}
                    key={quartier}
                  />
                ))}
            </Picker>
          </View>
        )}

        {/* Address Input */}
        <View className="mb-5">
          <Text className="text-lg mb-2">Adresse</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            className="bg-gray-200 py-3 px-4 rounded-md text-lg"
            placeholder="Entrez l'adresse du magasin"
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdateStore}
          className="bg-orange py-3 rounded-lg mt-4"
        >
          <Text className="text-center text-white font-semibold">
            Mettre à jour le magasin
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreScreen;
