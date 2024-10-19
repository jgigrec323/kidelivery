import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { communes } from "@/utils/communesGn";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigation } from "@react-navigation/native";
import COLORS from "@/constants/Colors";
import config from "@/utils/config";

// Define the types
interface Package {
  recipientName: string;
  recipientPhone: string;
  collectAtDoor: boolean;
  feeAmount: string;
}

interface CommuneData {
  commune: string;
  quartier: string;
  packages: Package[];
}

export default function MultipleScreen() {
  const [communeData, setCommuneData] = useState<CommuneData[]>([]);
  const [communePickup, setCommunePickup] = useState("");
  const [quartierPickup, setQuartierPickup] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();

  // Handle adding a commune
  const handleAddCommune = () => {
    setCommuneData([
      ...communeData,
      {
        commune: "",
        quartier: "",
        packages: [],
      },
    ]);
  };

  // Remove a commune
  const handleRemoveCommune = (communeIndex: number) => {
    setCommuneData(communeData.filter((_, index) => index !== communeIndex));
  };

  // Handle commune selection
  const handleCommuneChange = (index: number, value: string) => {
    const newData = [...communeData];
    newData[index].commune = value;
    setCommuneData(newData);
  };

  // Handle quartier selection
  const handleQuartierChange = (index: number, value: string) => {
    const newData = [...communeData];
    newData[index].quartier = value;
    setCommuneData(newData);
  };

  // Add a package to a specific commune
  const handleAddPackage = (communeIndex: number) => {
    const newData = [...communeData];
    newData[communeIndex].packages.push({
      recipientName: "",
      recipientPhone: "",
      collectAtDoor: false,
      feeAmount: "",
    });
    setCommuneData(newData);
  };

  // Remove a package
  const handleRemovePackage = (communeIndex: number, packageIndex: number) => {
    const newData = [...communeData];
    newData[communeIndex].packages = newData[communeIndex].packages.filter(
      (_, index) => index !== packageIndex
    );
    setCommuneData(newData);
  };

  // Handle package field changes
  const handlePackageChange = (
    communeIndex: number,
    packageIndex: number,
    field: keyof Package,
    value: string | boolean
  ) => {
    const newData = [...communeData];
    newData[communeIndex].packages[packageIndex][field] = value;
    setCommuneData(newData);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!communePickup || !quartierPickup) {
      Alert.alert("Error", "Please select a pickup location.");
      return false;
    }
    if (communeData.length === 0) {
      Alert.alert("Error", "Please add at least one delivery commune.");
      return false;
    }

    for (let i = 0; i < communeData.length; i++) {
      const commune = communeData[i];
      if (!commune.commune || !commune.quartier) {
        Alert.alert("Error", "Please select a commune and quartier.");
        return false;
      }

      for (let j = 0; j < commune.packages.length; j++) {
        const pkg = commune.packages[j];

        if (pkg.collectAtDoor && !pkg.feeAmount.trim()) {
          Alert.alert("Error", "Please enter the fee amount to be collected.");
          return false;
        }
      }
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      senderCommune: communePickup,
      senderQuartier: quartierPickup,
      pickupDate: pickupDate.toISOString(),
      pickupTime: pickupTime.toLocaleTimeString(),
      parcelsInMultiple: communeData.map((commune) => ({
        deliveryCommune: commune.commune,
        deliveryQuartier: commune.quartier,
        packages: commune.packages.map((pkg) => ({
          recipientName: pkg.recipientName,
          recipientPhone: pkg.recipientPhone,
          isFeeAtDoor: pkg.collectAtDoor, // Correctly map this field
          feeAtDoor: pkg.collectAtDoor ? parseInt(pkg.feeAmount, 10) : 0, // Convert to number
        })),
      })),
      userId: user.id,
      shopId: user.shops[0]?.id,
    };

    payload.parcelsInMultiple.forEach((p) => {
      console.log(p.packages);
    });

    try {
      const response = await fetch(`${config.API_BASE_URL}/requests/multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Parcels created successfully!");
        setCommunePickup("");
        setQuartierPickup("");
        setCommuneData([]);
        setPickupDate(new Date());
        setPickupTime(new Date());

        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert("Error", "Failed to create the parcels.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the parcels.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 mt-4">
      <ScrollView className="mb-44">
        {/* Pickup section */}
        <Text className="my-4 text-orange text-lg">Lieu de récupération</Text>
        <View className="space-y-3">
          <View className="bg-grayLight rounded-md">
            <Picker
              selectedValue={communePickup}
              onValueChange={setCommunePickup}
              className="border rounded-md text-lg"
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
          {communePickup && (
            <View className="bg-grayLight rounded-md">
              <Picker
                selectedValue={quartierPickup}
                onValueChange={setQuartierPickup}
                className="border rounded-md text-lg"
              >
                <Picker.Item label="Sélectionner un quartier" value="" />
                {communes
                  .find((c) => c.name === communePickup)
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
        </View>

        {/* Add Commune Button */}
        <Text className="my-4 text-orange text-lg">Lieux de livraison</Text>

        <Pressable
          className="py-3 px-4 rounded-md my-4 bg-black"
          onPress={handleAddCommune}
        >
          <Text className="text-white text-lg">
            Ajouter une Commune ({communeData.length})
          </Text>
        </Pressable>

        {/* Loop through each commune */}
        {communeData.map((communeItem, communeIndex) => (
          <View key={communeIndex} className="mb-8 p-4 border-2 rounded-md">
            {/* Remove Commune Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
              }}
              onPress={() => handleRemoveCommune(communeIndex)}
            >
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>

            {/* Commune Selection */}
            <Text className="mb-2 text-lg">Commune</Text>
            <View className="bg-grayLight rounded-md">
              <Picker
                selectedValue={communeItem.commune}
                onValueChange={(value) =>
                  handleCommuneChange(communeIndex, value)
                }
                className="border rounded-md text-lg"
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

            {/* Quartier Selection */}
            <Text className="mt-2 mb-2 text-lg">Quartier</Text>
            <View className="bg-grayLight rounded-md">
              <Picker
                selectedValue={communeItem.quartier}
                onValueChange={(value) =>
                  handleQuartierChange(communeIndex, value)
                }
                className="border rounded-md text-lg"
              >
                <Picker.Item label="Sélectionner un quartier" value="" />
                {communes
                  .find((c) => c.name === communeItem.commune)
                  ?.quartiers.map((quartier) => (
                    <Picker.Item
                      label={quartier}
                      value={quartier}
                      key={quartier}
                    />
                  ))}
              </Picker>
            </View>

            {/* Packages for the selected commune */}
            <View className="mt-4">
              {/* Add Package Button */}
              <Pressable
                className="py-2 px-3 rounded-md bg-black"
                onPress={() => handleAddPackage(communeIndex)}
              >
                <Text className="text-white text-lg">
                  Ajouter un colis ({communeItem.packages.length})
                </Text>
              </Pressable>

              {/* Loop through packages */}
              {communeItem.packages.map((pkg, pkgIndex) => (
                <View key={pkgIndex} className="mt-4 p-3 border rounded-md">
                  {/* Remove Package Button */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                    }}
                    onPress={() => handleRemovePackage(communeIndex, pkgIndex)}
                  >
                    <Ionicons name="close-circle" size={24} color="black" />
                  </TouchableOpacity>

                  <Text className="font-bold mb-2">Colis {pkgIndex + 1}</Text>

                  {/* Recipient Information */}
                  <TextInput
                    className="bg-grayLight py-3 px-4 rounded-md text-lg mt-2"
                    placeholder="Nom du destinataire"
                    value={pkg.recipientName}
                    onChangeText={(value) =>
                      handlePackageChange(
                        communeIndex,
                        pkgIndex,
                        "recipientName",
                        value
                      )
                    }
                  />
                  <TextInput
                    className="bg-grayLight py-3 px-4 rounded-md text-lg mt-3"
                    placeholder="Numéro du destinataire"
                    keyboardType="phone-pad"
                    value={pkg.recipientPhone}
                    onChangeText={(value) =>
                      handlePackageChange(
                        communeIndex,
                        pkgIndex,
                        "recipientPhone",
                        value
                      )
                    }
                  />

                  {/* Collect Fee at Door */}
                  <View className="flex-row items-center mt-4">
                    <TouchableOpacity
                      onPress={() =>
                        handlePackageChange(
                          communeIndex,
                          pkgIndex,
                          "collectAtDoor",
                          !pkg.collectAtDoor
                        )
                      }
                      className={`p-2 border rounded-md ${
                        pkg.collectAtDoor ? "bg-black" : "bg-gray-400"
                      }`}
                    >
                      <Text className="text-white">
                        {pkg.collectAtDoor ? "Oui" : "Non"}
                      </Text>
                    </TouchableOpacity>
                    <Text className="ml-3">Collecter les frais ?</Text>
                  </View>

                  {/* Fee Amount */}
                  {pkg.collectAtDoor && (
                    <TextInput
                      className="bg-grayLight py-3 px-4 mt-4 rounded-md text-lg"
                      placeholder="Montant des frais (en GNF)"
                      keyboardType="numeric"
                      value={pkg.feeAmount}
                      onChangeText={(value) =>
                        handlePackageChange(
                          communeIndex,
                          pkgIndex,
                          "feeAmount",
                          value
                        )
                      }
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Submit Button */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.orange} />
        ) : (
          <View className="mt-8">
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-orange py-3 rounded-lg"
            >
              <Text className="text-center text-white font-semibold">
                Valider la commande
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
