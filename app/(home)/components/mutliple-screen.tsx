import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { communes } from "@/utils/communesGn";
import { Ionicons } from "@expo/vector-icons";

// Define the types
interface Package {
  recipientName: string;
  recipientPhone: string;
  collectAtDoor: boolean;
  feeAmount: string;
}

interface CommuneData {
  commune: string;
  packages: Package[];
}

export default function MultipleScreen() {
  const [communeData, setCommuneData] = useState<CommuneData[]>([]);
  const [communePickup, setCommunePickup] = useState("");
  const [quartierPickup, setQuartierPickup] = useState("");

  // Function to handle adding a commune with packages
  const handleAddCommune = () => {
    setCommuneData([
      ...communeData,
      {
        commune: "",
        packages: [],
      },
    ]);
  };

  // Function to remove a commune
  const handleRemoveCommune = (communeIndex: number) => {
    setCommuneData(communeData.filter((_, index) => index !== communeIndex));
  };

  // Function to handle commune selection
  const handleCommuneChange = (index: number, value: string) => {
    const newData = [...communeData];
    newData[index].commune = value;
    setCommuneData(newData);
  };

  // Function to handle adding a package to a specific commune
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

  // Function to remove a package
  const handleRemovePackage = (communeIndex: number, packageIndex: number) => {
    const newData = [...communeData];
    newData[communeIndex].packages = newData[communeIndex].packages.filter(
      (_, index) => index !== packageIndex
    );
    setCommuneData(newData);
  };

  // Function to handle package field changes
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

  return (
    <View className="flex-1 mt-4">
      <ScrollView className="mb-44">
        <Text className="my-4 text-orange text-lg">Lieu de récupération</Text>
        <View className="space-y-3">
          {/* Commune and Quartier for Pickup */}
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
          <View key={communeIndex} className="mb-8 p-4  border-2  rounded-md">
            {/* X Button to Remove Commune */}
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
                  {/* X Button to Remove Package */}
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

        {/* Total Price Section */}
        <View className="mt-10 bg-grayLight w-full px-3 py-3 flex flex-row justify-between items-center">
          <View>
            <Text className="font-bold text-lg">Coût total</Text>
            <Text className="text-lg font-bold">
              {/* Add price calculation here */} GNF
            </Text>
          </View>
          <Pressable
            className="bg-black px-4 h-12 w-1/2 flex items-center justify-center rounded-xl"
            onPress={() => {
              // Handle submit logic
            }}
          >
            <Text className="text-white font-bold text-lg">Enregistrer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
