import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
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
      <CustomHeader h={80} title="Détails du colis" />

      {/* Ticket-style card layout */}
      <ScrollView className="bg-white h-full px-4">
        <View className="bg-white rounded-lg px-5 pt-1 my-4 border-l-8  shadow-md">
          <Text className="text-2xl font-bold text-black mb-4">
            Colis {parcel.trackingNumber}
          </Text>

          {/* Parcel Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Détails du colis
            </Text>
            <Text className="text-gray-800">Nom: {parcel.name}</Text>
            <Text className="text-gray-800">
              Description: {parcel.description}
            </Text>
            <Text className="text-gray-800">Statut: {parcel.status}</Text>
            <Text className="text-gray-800">Type: {parcel.parcelType}</Text>
          </View>

          {/* Pickup Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Informations de ramassage
            </Text>
            <Text className="text-gray-800">
              Commune: {parcel.senderCommune}
            </Text>
            <Text className="text-gray-800">
              Quartier: {parcel.senderQuartier}
            </Text>
            <Text className="text-gray-800">
              Date: {new Date(parcel.pickupDate).toLocaleDateString()}
            </Text>
            <Text className="text-gray-800">Heure: {parcel.pickupTime}</Text>
          </View>

          {/* Delivery Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Informations de livraison
            </Text>
            <Text className="text-gray-800">
              Commune: {parcel.deliveryCommune}
            </Text>
            <Text className="text-gray-800">
              Quartier: {parcel.deliveryQuartier}
            </Text>
            <Text className="text-gray-800">
              Date: {new Date(parcel.dropoffDate).toLocaleDateString()}
            </Text>
            <Text className="text-gray-800">Heure: {parcel.dropoffTime}</Text>
          </View>

          {/* Recipient Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-orange-500 mb-1">
              Informations du destinataire
            </Text>
            <Text className="text-gray-800">
              Nom du destinataire: {parcel.recipientName}
            </Text>
            <Text className="text-gray-800">
              Téléphone du destinataire: {parcel.recipientPhone}
            </Text>
          </View>

          {/* Fee Details */}
          {parcel.isFeeAtDoor && parcel.feeAtDoor ? (
            <View className="mb-6">
              <Text className="text-lg font-bold text-orange-500 mb-1">
                Frais de collecte à la porte
              </Text>
              <Text className="text-gray-800">
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
