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
import COLORS from "@/constants/Colors";
import config from "@/utils/config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CargaisonScreen() {
  const [communePickup, setCommunePickup] = useState("");
  const [quartierPickup, setQuartierPickup] = useState("");
  const [communeDelivery, setCommuneDelivery] = useState("");
  const [quartierDelivery, setQuartierDelivery] = useState("");

  const [description, setDescription] = useState(""); // For adding description
  const [recipientName, setRecipientName] = useState(""); // Recipient Name
  const [recipientPhone, setRecipientPhone] = useState(""); // Recipient Phone

  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState(new Date());

  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, []);

  // Handlers for date and time pickers
  const onPickupDateChange = (event, selectedDate) => {
    setShowPickupDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const onPickupTimeChange = (event, selectedTime) => {
    setShowPickupTimePicker(false);
    if (selectedTime) {
      setPickupTime(selectedTime);
    }
  };

  const onDeliveryDateChange = (event, selectedDate) => {
    setShowDeliveryDatePicker(false);
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const onDeliveryTimeChange = (event, selectedTime) => {
    setShowDeliveryTimePicker(false);
    if (selectedTime) {
      setDeliveryTime(selectedTime);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    if (!communePickup || !quartierPickup) {
      Alert.alert("Error", "Please select a pickup location.");
      return false;
    }
    if (!communeDelivery || !quartierDelivery) {
      Alert.alert("Error", "Please select a delivery location.");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description for the cargaison.");
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
    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      name: "Cargaison", // Name for the cargaison request
      description: description.trim(), // Use description input
      parcelType: "CARGO", // Cargaison type
      senderCommune: communePickup,
      senderQuartier: quartierPickup,
      pickupDate: pickupDate.toISOString(),
      pickupTime: pickupTime.toLocaleTimeString(),
      deliveryCommune: communeDelivery,
      deliveryQuartier: quartierDelivery,
      dropoffDate: deliveryDate.toISOString(),
      dropoffTime: deliveryTime.toLocaleTimeString(),
      isFeeAtDoor: false, // Assuming no fee at door for Cargaison
      feeAtDoor: 0,
      recipientName: recipientName.trim(), // Add recipient name
      recipientPhone: recipientPhone.trim(), // Add recipient phone
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
        Alert.alert("Success", "Cargaison request created successfully!");
        // Reset form after successful submission
        setCommunePickup("");
        setQuartierPickup("");
        setCommuneDelivery("");
        setQuartierDelivery("");
        setPickupDate(new Date());
        setPickupTime(new Date());
        setDeliveryDate(new Date());
        setDeliveryTime(new Date());
        setDescription(""); // Reset description
        setRecipientName(""); // Reset recipient name
        setRecipientPhone(""); // Reset recipient phone
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert("Error", "Failed to create the cargaison request.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while creating the cargaison request."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 mt-4">
      <ScrollView className="mb-44">
        {/* Colis and Description */}
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Colis"
            placeholderTextColor={"black"}
            value="Cargaison"
            editable={false} // Fixed name for Cargaison
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Description"
            placeholderTextColor={"black"}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Lieu de récupération */}
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
          {/* Commune and Quartier for Delivery */}
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

        {/* Recipient Information */}
        <Text className="my-4 text-orange text-lg">Destinataire</Text>
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Nom du destinataire"
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Téléphone du destinataire"
            keyboardType="phone-pad"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
          />
        </View>

        <Text className="mt-4">
          * Nos agents vous contacteront après avoir reçu la requête
        </Text>

        {/* Button to make request */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-orange py-3 rounded-lg"
          >
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.white} />
            ) : (
              <Text className="text-center text-white font-semibold">
                Valider la commande
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
