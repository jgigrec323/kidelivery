import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    index: (isFocused: boolean) => (
      <MaterialCommunityIcons
        name="home-variant"
        size={25}
        color={isFocused ? COLORS.orange : COLORS.black}
      />
    ),
    create: (isFocused: boolean) => (
      <View
        style={{ backgroundColor: COLORS.orange }}
        className="  h-14 w-14 
      justify-center items-center rounded-full -translate-y-5"
      >
        <Feather
          name="box"
          size={27}
          color={isFocused ? COLORS.white : COLORS.white}
        />
      </View>
    ),
    profile: (isFocused: boolean) => (
      <Ionicons
        name="person"
        size={25}
        color={isFocused ? COLORS.orange : COLORS.black}
      />
    ),
  };

  return (
    <View className="flex items-center">
      <View
        className="bg-gray-50 flex 
      flex-row h-14 justify-around 
      items-center w-full 
      rounded-tr-3xl rounded-tl-3xl 
      shadow-md shadow-black	"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const isMiddleTab = route.name === "create";

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {icons[route.name](isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
