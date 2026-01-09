import { Drawer } from "expo-router/drawer"; //Drawer navigation, side navigation menu
import { useContext } from "react";
import { ThemeContext } from "../../src/context/ThemeContext";

export default function DrawerLayout() { //define and export the DrawerLayout component
  const { colors } = useContext(ThemeContext);

  return (
    <Drawer
      screenOptions={{ // applies defaul styling and beahvior to all screens in the drawer
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 260,
        },
        drawerLabelStyle: {
          color: colors.text,
        },
      }}
    >
      <Drawer.Screen //refers to app/(drawer)/products/index.js
        name="products"
        options={{ title: "Products" }}
      />
      <Drawer.Screen //refers to app/(drawer)/cart.js
        name="cart"
        options={{ title: "Cart" }}
      />
      <Drawer.Screen //refers to app/(drawer)/profile.js
        name="profile"
        options={{ title: "Profile" }}
      />
    </Drawer>
  );
}//defines shared navigation and UI behavior for all screens inside its folder.
//This layout file configures a drawer-based navigation system using Expo Router, 
//applying theme-aware styling and mapping application screens to a centralized side menu

// difference between the other _layout.js is that this one is for drawer navigation.Works only for screens inside the (drawer) folder.
//the other one is for stack navigation which is the root layout of the app. Works on the entire app. Entry point of the app
//The root _layout.js defines global providers and stack navigation for the entire application, 
// while the nested (drawer)/_layout.js defines section-level navigation using a drawer for authenticated screens. 
// Expo Router composes these layouts hierarchically