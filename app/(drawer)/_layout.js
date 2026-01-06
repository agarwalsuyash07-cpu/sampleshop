import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { ThemeContext } from "../../src/context/ThemeContext";

export default function DrawerLayout() {
  const { colors } = useContext(ThemeContext);

  return (
    <Drawer
      screenOptions={{
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
      <Drawer.Screen
        name="products"
        options={{ title: "Products" }}
      />
      <Drawer.Screen
        name="cart"
        options={{ title: "Cart" }}
      />
      <Drawer.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Drawer>
  );
}
