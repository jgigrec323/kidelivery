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
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { communes } from "@/utils/communesGn";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import config from "@/utils/config";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Assuming your Redux store has a RootState type
import COLORS from "@/constants/Colors";
import { router } from "expo-router";
import { calculateDeliveryFee } from "@/utils/calculateFee";

export default function SingleScreen() {
  const user = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [communePickup, setCommunePickup] = useState<string>("");
  const [quartierPickup, setQuartierPickup] = useState<string>("");
  const [communeDelivery, setCommuneDelivery] = useState<string>("");
  const [quartierDelivery, setQuartierDelivery] = useState<string>("");

  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [deliveryTime, setDeliveryTime] = useState<Date>(new Date());

  const [showPickupDatePicker, setShowPickupDatePicker] =
    useState<boolean>(false);
  const [showPickupTimePicker, setShowPickupTimePicker] =
    useState<boolean>(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] =
    useState<boolean>(false);
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] =
    useState<boolean>(false);

  const [price, setPrice] = useState<number>(125000);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [collectAtDoor, setCollectAtDoor] = useState<boolean>(false);
  const [feeAmount, setFeeAmount] = useState<string>("");

  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, []);

  useEffect(() => {
    if (communePickup && communeDelivery) {
      const calculatedFee = calculateDeliveryFee({
        senderCommune: communePickup,
        deliveryCommune: communeDelivery,
        parcelType: "SINGLE",
      });
      setPrice(calculatedFee);
    } else {
      setPrice(0); // Reset to 0 if communes are not selected
    }
  }, [communePickup, communeDelivery]);

  const formattedPickupDateTime = `${pickupDate.toISOString().split("T")[0]}T${
    pickupTime.toTimeString().split(" ")[0]
  }Z`;

  const formattedDeliveryDateTime = `${
    deliveryDate.toISOString().split("T")[0]
  }T${deliveryTime.toTimeString().split(" ")[0]}Z`;

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a valid parcel name.");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please provide a parcel description.");
      return false;
    }
    if (!communePickup || !quartierPickup) {
      Alert.alert("Error", "Please select a pickup location.");
      return false;
    }
    if (!communeDelivery || !quartierDelivery) {
      Alert.alert("Error", "Please select a delivery location.");
      return false;
    }
    if (!recipientName.trim()) {
      Alert.alert("Error", "Please provide the recipient's name.");
      return false;
    }
    if (!recipientPhone.trim() || recipientPhone.length < 8) {
      Alert.alert("Error", "Please provide a valid recipient phone number.");
      return false;
    }
    if (collectAtDoor && !feeAmount.trim()) {
      Alert.alert("Error", "Please enter the fee amount to be collected.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(false);
    if (!validateForm()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      parcelType: "SINGLE",
      senderCommune: communePickup,
      senderQuartier: quartierPickup,
      pickupDate: formattedPickupDateTime,
      pickupTime: pickupTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      deliveryCommune: communeDelivery,
      deliveryQuartier: quartierDelivery,
      dropoffDate: formattedDeliveryDateTime,
      dropoffTime: deliveryTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFeeAtDoor: collectAtDoor,
      feeAtDoor: collectAtDoor ? Number(feeAmount) : 0,
      shopId: user.shops[0]?.id || "", // Safe access with fallback
      userId: user.id || "", // Safe access with fallback
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Parcel created successfully!");
      } else {
        Alert.alert("Error", "Failed to create the parcel.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the parcel.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      router.push("/(home)/(tabs)");
    }
  };

  const onPickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const onPickupTimeChange = (event: any, selectedTime?: Date) => {
    setShowPickupTimePicker(false);
    if (selectedTime) {
      setPickupTime(selectedTime);
    }
  };

  const onDeliveryDateChange = (event: any, selectedDate?: Date) => {
    setShowDeliveryDatePicker(false);
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const onDeliveryTimeChange = (event: any, selectedTime?: Date) => {
    setShowDeliveryTimePicker(false);
    if (selectedTime) {
      setDeliveryTime(selectedTime);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.orange} />;
  }

  return (
    <View className="flex-1 mt-4">
      <ScrollView className="mb-44">
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Colis"
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Description"
            placeholderTextColor="black"
            value={description}
            onChangeText={setDescription}
          />
        </View>

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

        {/* Date and Time Pickers for Pickup */}
        <View className="mt-3 flex flex-row space-x-3">
          <TouchableOpacity onPress={() => setShowPickupDatePicker(true)}>
            <TextInput
              className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
              value={pickupDate.toLocaleDateString()}
              placeholder="Sélectionner la date"
              editable={false}
            />
          </TouchableOpacity>
          {showPickupDatePicker && (
            <DateTimePicker
              value={pickupDate}
              mode="date"
              display="default"
              onChange={onPickupDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowPickupTimePicker(true)}>
            <TextInput
              className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
              value={pickupTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              placeholder="Sélectionner l'heure"
              editable={false}
            />
          </TouchableOpacity>
          {showPickupTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display="default"
              onChange={onPickupTimeChange}
            />
          )}
        </View>

        {/* Lieu de livraison */}
        <Text className="my-4 text-orange text-lg">Lieu de livraison</Text>
        <View className="space-y-3">
          <View className="bg-grayLight rounded-md">
            <Picker
              selectedValue={communeDelivery}
              onValueChange={setCommuneDelivery}
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
          {communeDelivery && (
            <View className="bg-grayLight rounded-md">
              <Picker
                selectedValue={quartierDelivery}
                onValueChange={setQuartierDelivery}
                className="border rounded-md text-lg"
              >
                <Picker.Item label="Sélectionner un quartier" value="" />
                {communes
                  .find((c) => c.name === communeDelivery)
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

        {/* Date and Time Pickers for Delivery */}
        <View className="mt-3 flex flex-row space-x-3">
          <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
            <TextInput
              className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
              value={deliveryDate.toLocaleDateString()}
              placeholder="Sélectionner la date"
              editable={false}
            />
          </TouchableOpacity>
          {showDeliveryDatePicker && (
            <DateTimePicker
              value={deliveryDate}
              mode="date"
              display="default"
              onChange={onDeliveryDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowDeliveryTimePicker(true)}>
            <TextInput
              className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
              value={deliveryTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              placeholder="Sélectionner l'heure"
              editable={false}
            />
          </TouchableOpacity>
          {showDeliveryTimePicker && (
            <DateTimePicker
              value={deliveryTime}
              mode="time"
              display="default"
              onChange={onDeliveryTimeChange}
            />
          )}
        </View>

        <Text className="my-4 text-orange text-lg">Destinataire</Text>
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Nom du destinataire"
            placeholderTextColor="black"
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Téléphone du destinataire"
            placeholderTextColor="black"
            keyboardType="phone-pad"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
          />
          <View className="flex-row items-center space-x-3">
            <Pressable
              className={`w-6 h-6 border-2 ${
                collectAtDoor ? "border-orange" : "border-gray-400"
              } rounded-md justify-center items-center`}
              onPress={() => setCollectAtDoor(!collectAtDoor)}
            >
              {collectAtDoor && <Text className="text-orange">✓</Text>}
            </Pressable>
            <Text>Collecter les frais à la livraison</Text>
          </View>
          {collectAtDoor && (
            <TextInput
              className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
              placeholder="Montant des frais"
              placeholderTextColor="black"
              keyboardType="numeric"
              value={feeAmount}
              onChangeText={setFeeAmount}
            />
          )}
        </View>

        <View className="mt-4 p-3 bg-gray-100 rounded-md">
          <Text className="text-lg font-semibold text-black">
            Coût de la livraison
          </Text>
          <Text className="text-xl font-bold text-orange mt-1">
            {price.toLocaleString()} GNF
          </Text>
          <Text className="text-gray-500 text-sm">
            Le coût est calculé en fonction de la distance entre les communes.
          </Text>
        </View>

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
      </ScrollView>
    </View>
  );
}
