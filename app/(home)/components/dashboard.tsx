import { View, Text } from "react-native";
import React from "react";
import Logo from "@/components/logo";
import DashboardBlock from "./dashboard-block";

const Dashboard = () => {
  return (
    <View className="bg-orange h-[34%] rounded-bl-xl rounded-br-xl">
      <Logo
        textStyle="text-white text-xl font-bold"
        className="flex flex-row justify-center mt-4"
      ></Logo>

      <View className="p-7">
        <Text className="text-white text-lg">
          Bienvenue <Text className="font-bold">Ibrahima</Text>
        </Text>
        <View
          style={{ columnGap: 10 }}
          className="flex flex-row justify-between mt-5"
        >
          <View style={{ flex: 3, gap: 10 }} className="flex">
            <View style={{ columnGap: 10 }} className="flex flex-row">
              <DashboardBlock
                containerStyle={{ flex: 3 / 2 }}
                value={1}
                title="En cours d'expédition"
              />
              <DashboardBlock
                containerStyle={{ flex: 3 / 2 }}
                value={0}
                title="Retour de         colis"
              />
            </View>
            <View className="flex-row">
              <DashboardBlock
                containerStyle={{ flex: 3 }}
                value={184}
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
              value={1}
              containerStyle={{ flex: 1 }}
              title="En cours d'expédition"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
