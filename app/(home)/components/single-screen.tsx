import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { communes } from "@/utils/communesGn";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import COLORS from "@/constants/Colors";

export default function SingleScreen() {
  const [communePickup, setCommunePickup] = useState("");
  const [quartierPickup, setQuartierPickup] = useState("");
  const [communeDelivery, setCommuneDelivery] = useState("");
  const [quartierDelivery, setQuartierDelivery] = useState("");

  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState(new Date());

  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);

  const [price, setPrice] = useState(125000); // Example price per item
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [collectAtDoor, setCollectAtDoor] = useState(false); // Field for pickup fee at the door
  const [feeAmount, setFeeAmount] = useState(""); // Fee to be collected at the door

  const navigation = useNavigation();

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

  return (
    <View className="flex-1 mt-4">
      {/* Form Section */}
      <ScrollView className="mb-44">
        {/* Added mb-20 for spacing at the bottom */}
        {/* Colis and Description */}
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Colis"
            placeholderTextColor={"black"}
            onChangeText={() => {}}
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Description"
            placeholderTextColor={"black"}
            onChangeText={() => {}}
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
        <Text className="my-4 text-orange text-lg">
          Informations sur le destinataire
        </Text>
        <View className="space-y-3">
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Nom complet"
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <TextInput
            className="bg-grayLight py-3 px-4 rounded-md text-lg text-black"
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
          />
        </View>

        {/* Collect Fee at the Door */}
        <View className="flex flex-row items-center mt-4">
          <TouchableOpacity
            onPress={() => setCollectAtDoor(!collectAtDoor)}
            className={`p-2 border rounded-md ${
              collectAtDoor ? "bg-black" : "bg-gray-400"
            }`}
          >
            <Text className="text-white">{collectAtDoor ? "Oui" : "Non"}</Text>
          </TouchableOpacity>
          <Text className="ml-3">
            Le livreur doit-il récupérer les frais à la porte ?
          </Text>
        </View>

        {/* Fee Amount Field */}
        {collectAtDoor && (
          <TextInput
            className="bg-grayLight py-3 px-4 mt-4 rounded-md text-lg text-black"
            placeholder="Montant des frais (en GNF)"
            keyboardType="numeric"
            value={feeAmount}
            onChangeText={setFeeAmount}
          />
        )}

        {/* Price Section */}
        <View className="mt-10 bg-grayLight w-full px-3 py-3 flex flex-row justify-between items-center">
          <View>
            <Text className="font-bold text-lg text-orange">Coût total</Text>
            <Text className="text-lg font-bold">{price} GNF</Text>
          </View>
          <Pressable
            className="bg-black  px-4 h-12 w-1/2 flex items-center justify-center rounded-xl"
            onPress={() => {}}
          >
            <Text className="text-white font-bold text-lg">Enregistrer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
