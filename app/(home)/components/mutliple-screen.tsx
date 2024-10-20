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
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigation } from "@react-navigation/native";
import COLORS from "@/constants/Colors";
import config from "@/utils/config";
import { calculateDeliveryFee } from "@/utils/calculateFee";
import { communes } from "@/utils/communesGn";

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
  const [loading, setLoading] = useState(false);
  const [useShopAddress, setUseShopAddress] = useState<boolean>(false); // NEW: toggle for shop address
  const [totalPrice, setTotalPrice] = useState<number>(0); // For total delivery price

  const user = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();

  // Handle adding a commune
  const handleAddCommune = () => {
    setCommuneData((prevData) => [
      ...prevData,
      {
        commune: "",
        quartier: "",
        packages: [],
      },
    ]);
  };

  // Remove a commune
  const handleRemoveCommune = (communeIndex: number) => {
    const updatedData = communeData.filter(
      (_, index) => index !== communeIndex
    );
    setCommuneData(updatedData);
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
    //@ts-ignore
    newData[communeIndex].packages[packageIndex][field] = value;
    setCommuneData(newData);
  };

  // Calculate total price based on communes and packages
  useEffect(() => {
    let total = 0;

    communeData.forEach((commune) => {
      const communeFee = calculateDeliveryFee({
        senderCommune: communePickup,
        deliveryCommune: commune.commune,
        parcelType: "MULTIPLE",
      });

      total += commune.packages.length * communeFee; // Price based on number of packages
    });

    setTotalPrice(total);
  }, [communeData, communePickup]);

  // Update the pickup location if using shop address
  useEffect(() => {
    if (useShopAddress && user.shops[0]) {
      // Update communePickup and quartierPickup with shop's info
      setCommunePickup(user.shops[0].commune);
      setQuartierPickup(user.shops[0].quartier);
    } else {
      // Clear values if not using shop address
      setCommunePickup("");
      setQuartierPickup("");
    }
  }, [useShopAddress, user.shops]);

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

      // Skip this validation if using the shop address
      if (!useShopAddress) {
        if (!commune.commune || !commune.quartier) {
          Alert.alert("Error", "Please select a commune and quartier.");
          return false;
        }
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
        <View className="flex-row items-center space-x-3 my-4">
          <Pressable
            className={`w-6 h-6 border-2 ${
              useShopAddress ? "border-orange" : "border-gray-400"
            } rounded-md justify-center items-center`}
            onPress={() => setUseShopAddress(!useShopAddress)}
          >
            {useShopAddress && <Text className="text-orange">✓</Text>}
          </Pressable>
          <Text>Utiliser l'adresse de mon magasin</Text>
        </View>

        {/* Show shop address if selected */}
        {useShopAddress ? (
          <View className="bg-grayLight p-3 rounded-md">
            <Text className="text-lg text-black">
              {user.shops[0]?.commune}, {user.shops[0]?.quartier}
            </Text>
          </View>
        ) : (
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
        )}

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

            {/* Packages for the selected commune */}
            <View className="mt-4">
              <Pressable
                className="py-2 px-3 rounded-md bg-black"
                onPress={() => handleAddPackage(communeIndex)}
              >
                <Text className="text-white text-lg">
                  Ajouter un colis ({communeItem.packages.length})
                </Text>
              </Pressable>

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
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Delivery Cost Box */}
        <View className="mt-4 p-3 bg-gray-100 rounded-md">
          <Text className="text-lg font-semibold text-black">
            Coût total de la livraison
          </Text>
          <Text className="text-xl font-bold text-orange mt-1">
            {totalPrice.toLocaleString()} GNF
          </Text>
        </View>

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
