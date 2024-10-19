import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // Ensure this is for React Navigation
import axios from "axios";
import config from "@/utils/config";
import COLORS from "@/constants/Colors";
import CustomHeader from "@/components/custom-header";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/formatMoney";
import { Ionicons } from "@expo/vector-icons";

const ParcelDetails = () => {
  const route = useRoute();
  const { parcelId } = route.params as { parcelId: string };

  const [parcel, setParcel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcelDetails = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/parcels/${parcelId}`
      );
      setParcel(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des détails du colis");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelDetails();
  }, [parcelId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader h={100} title="Détails du colis" />

      {/* Ticket-style card layout */}
      <ScrollView className="bg-white h-full px-4">
        <View className="bg-gray-100 rounded-lg p-4 my-4 border-l-8 border-orange-500 shadow-sm">
          <Text className="text-2xl font-bold text-black mb-4">
            Colis {parcel.trackingNumber}
          </Text>

          {/* Parcel Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Détails du colis
            </Text>
            <Text className="text-gray-700">Nom: {parcel.name}</Text>
            <Text className="text-gray-700">
              Description: {parcel.description}
            </Text>
            <Text className="text-gray-700">Statut: {parcel.status}</Text>
            <Text className="text-gray-700">Type: {parcel.parcelType}</Text>
          </View>

          {/* Pickup Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Informations de ramassage
            </Text>
            <Text className="text-gray-700">
              Commune: {parcel.senderCommune}
            </Text>
            <Text className="text-gray-700">
              Quartier: {parcel.senderQuartier}
            </Text>
            <Text className="text-gray-700">Date: {parcel.pickupDate}</Text>
            <Text className="text-gray-700">Heure: {parcel.pickupTime}</Text>
          </View>

          {/* Delivery Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Informations de livraison
            </Text>
            <Text className="text-gray-700">
              Commune: {parcel.deliveryCommune}
            </Text>
            <Text className="text-gray-700">
              Quartier: {parcel.deliveryQuartier}
            </Text>
            <Text className="text-gray-700">Date: {parcel.dropoffDate}</Text>
            <Text className="text-gray-700">Heure: {parcel.dropoffTime}</Text>
          </View>

          {/* Fee Details */}
          {parcel.isFeeAtDoor && parcel.feeAtDoor ? (
            <View className="mb-6">
              <Text className="text-lg font-bold text-orange-500 mb-1">
                Frais de collecte à la porte
              </Text>
              <Text className="text-gray-700">
                {formatMoney(parcel.feeAtDoor)} GNF
              </Text>
            </View>
          ) : (
            <Text className="text-lg font-bold text-orange-500 mb-4">
              Pas de frais à la porte
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom tracking button */}
      <View className="absolute bottom-5 left-5 right-5">
        <TouchableOpacity
          className="bg-orange rounded-full py-4 flex-row justify-center items-center shadow-lg"
          onPress={() => {
            /* handle tracking action */
          }}
        >
          <Ionicons name="location-outline" size={22} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Suivre le colis
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ParcelDetails;
