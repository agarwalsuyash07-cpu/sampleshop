import "react-native-gesture-handler"; // handles complex gestures and interactions, native detects --> js reacts, must be at the top cuz all other imports depend on it.
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import Toast from "react-native-toast-message";
import {View,Text} from "react-native";
const toastConfig = {
  success: (props) => (
    <View
      style={{
        backgroundColor: "#22c55e",
        padding: 16,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>
        {props.text1}
      </Text>
      <Text style={{ color: "#fff" }}>
        {props.text2}
      </Text>
    </View>
  ),
};


export default function RootLayout() { // root layout for the app, export default makes it the primary component
  return (
    <ThemeProvider> {/* provides theme context to the app, All screens use it so its called first*/}
      <AuthProvider> {/* provides authentication context to the app, The app is personal to all users*/}
        <CartProvider>
          <> {/* provides shopping cart context to the app, All users have a cart, cart depends on authenticated users*/}
          <Stack screenOptions={{ headerShown: false }} /> {/* Stack navigator for managing screen transitions, header is hidden for custom headers*/}
          <Toast config={toastConfig} /> {/* Toast component for displaying brief messages to the user, global component for notifications*/}
          </>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
