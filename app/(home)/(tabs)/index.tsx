import {
  Pressable,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import Dashboard from "../components/dashboard";
import MainTitle from "../components/mainTitle";
import BeingShippedBox from "@/components/being-shipped-box";
import COLORS from "@/constants/Colors";
import AlreadyShippedBox from "@/components/already-shipped-box";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import config from "@/utils/config";
import { setUser } from "@/store/slices/authSlice";
import { Parcel, User, Order, Delivery } from "@/utils/types";
import {
  selectThreeMostRecentParcels,
  setParcels,
  clearParcels,
} from "@/store/slices/parcelSlice";
import { setOrders, clearOrders } from "@/store/slices/orderSlice";
import { setDeliveries, clearDeliveries } from "@/store/slices/deliverySlice";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

const Home = () => {
  const { user } = useUser();
  const threeMostRecentParcels = useSelector(selectThreeMostRecentParcels);
  const phone = user?.primaryPhoneNumber?.toString();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to set user data
  const setUserData = (userData: User) => {
    dispatch(
      setUser({
        id: userData.id,
        phoneNumber: userData.phoneNumber,
        fullName: userData.name,
        shops: userData.shops,
      })
    );
  };

  // Fetch all data (user, parcels, orders, deliveries)
  const fetchData = async () => {
    try {
      // Clear slices before fetching
      dispatch(clearParcels());
      dispatch(clearOrders());
      dispatch(clearDeliveries());

      // 1. Fetch user information
      const userResponse = await axios.get<User>(
        `${config.API_BASE_URL}/users/${phone}`
      );
      const userData = userResponse.data;
      setUserData(userData);

      // 2. Fetch parcels
      const parcelsResponse = await axios.get<Parcel[]>(
        `${config.API_BASE_URL}/requests/${userData.id}`
      );
      dispatch(setParcels(parcelsResponse.data));

      // 3. Fetch orders
      const ordersResponse = await axios.get<Order[]>(
        `${config.API_BASE_URL}/orders/${userData.id}`
      );
      dispatch(setOrders(ordersResponse.data));

      // 4. Fetch deliveries
      const deliveriesResponse = await axios.get<Delivery[]>(
        `${config.API_BASE_URL}/deliveries/${userData.id}`
      );
      dispatch(setDeliveries(deliveriesResponse.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Use focus effect to fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <View className="bg-white h-full">
        <Dashboard />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="pt-4 px-4 space-y-4">
            <MainTitle title="En cours d'expédition" />
            <BeingShippedBox />

            <View className="flex flex-row justify-between items-center">
              <MainTitle title="Historique" />
              <Pressable
                onPress={() => router.navigate("/(home)/(screens)/history")}
              >
                <Text className="text-gray-dark">Voir tout</Text>
              </Pressable>
            </View>

            <View>
              {threeMostRecentParcels.length === 0 ? (
                <View className="flex items-center justify-center h-16">
                  <Text>Vous n'avez pas encore commandé</Text>
                </View>
              ) : (
                threeMostRecentParcels.map((parcel, index) => (
                  <View
                    key={parcel.id}
                    style={{
                      marginBottom:
                        index !== threeMostRecentParcels.length - 1 ? 10 : 0,
                    }}
                  >
                    <AlreadyShippedBox
                      name={parcel.name}
                      id={parcel.trackingNumber}
                      status={parcel.status}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
