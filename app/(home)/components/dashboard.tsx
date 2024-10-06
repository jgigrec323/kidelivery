import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Logo from "@/components/logo";
import DashboardBlock from "./dashboard-block";
import { useUser } from "@clerk/clerk-expo";
import { getFirstName } from "@/utils/getFirstName";
import axios from "axios";
import config from "@/utils/config";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { Parcel, User } from "@/utils/types";
import { RootState } from "@/store";

const Dashboard = () => {
  const { user } = useUser();
  const username = getFirstName(user?.fullName);
  const dispatch = useDispatch();
  const parcels = useSelector((state: RootState) => state.parcels);

  useEffect(() => {
    console.log(parcels);
  }, [dispatch]);

  return (
    <View className="bg-orange h-[34%] rounded-bl-xl rounded-br-xl">
      <Logo
        textStyle="text-white text-xl font-bold"
        className="flex flex-row justify-center mt-4"
      />

      <View className="p-7">
        <Text className="text-white text-lg">
          Bienvenue <Text className="font-bold">{username}</Text>
        </Text>
        <View
          style={{ columnGap: 10 }}
          className="flex flex-row justify-between mt-5"
        >
          <View style={{ flex: 3, gap: 10 }} className="flex">
            <View style={{ columnGap: 10 }} className="flex flex-row">
              <DashboardBlock
                containerStyle={{ flex: 3 / 2 }}
                value={parcels.inTransitCount}
                title="En cours d'expédition"
              />
              <DashboardBlock
                containerStyle={{ flex: 3 / 2 }}
                value={parcels.returnedCount}
                title="Retour de         colis "
              />
            </View>
            <View className="flex-row">
              <DashboardBlock
                containerStyle={{ flex: 3 }}
                value={parcels.deliveredCount}
                title="Colis expédiés"
              />
            </View>
          </View>
          <View
            style={{
              flex: 1.5,
              alignSelf: "stretch",
            }}
          >
            <DashboardBlock
              value={parcels.pendingCount}
              containerStyle={{ flex: 1 }}
              title="En attente"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
