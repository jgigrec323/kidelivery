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
import { Parcel, User } from "@/utils/types";
import {
  selectThreeMostRecentParcels,
  setParcels,
  clearParcels,
} from "@/store/slices/parcelSlice";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook

const Home = () => {
  const { user } = useUser();
  const threeMostRecentParcels = useSelector(selectThreeMostRecentParcels);
  const phone = user?.primaryPhoneNumber?.toString();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch parcels and update Redux store
  const fetchParcels = async () => {
    dispatch(clearParcels());

    const response = await axios.get<User>(
      `${config.API_BASE_URL}/users/${phone}`
    );
    const user = response.data;
    dispatch(
      setUser({
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.name,
        shops: user.shops,
      })
    );

    const parcelsRep = await axios.get<Parcel[]>(
      `${config.API_BASE_URL}/requests/${user.id}`
    );
    const parcels = parcelsRep.data;
    dispatch(setParcels(parcels));
  };

  // Fetch parcels when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchParcels();
    }, []) // Empty dependency array ensures this only runs when the screen is focused
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchParcels(); // Refresh data
    setRefreshing(false); // Stop the refreshing indicator
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
          <View className="pt-4 px-4">
            <View style={{ display: "flex", rowGap: 10 }}>
              <MainTitle title="En cours d'expédition"></MainTitle>
              <BeingShippedBox></BeingShippedBox>
              <View className="flex flex-row justify-between items-center">
                <MainTitle title="Historique"></MainTitle>
                <Pressable>
                  <Text style={{ color: COLORS.grayDark }}>Voir tout</Text>
                </Pressable>
              </View>
              <View style={{ rowGap: 10 }} className="">
                {threeMostRecentParcels.length === 0 && (
                  <View className="flex items-center justify-center h-16">
                    <Text>Vous n'avez pas encore commandé</Text>
                  </View>
                )}

                {threeMostRecentParcels.map((parcel) => {
                  return (
                    <AlreadyShippedBox
                      name={parcel.name}
                      id={parcel.trackingNumber}
                      status={parcel.status}
                      key={parcel.id}
                    ></AlreadyShippedBox>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
