import { Stack } from "expo-router";
import { Text, View } from "react-native";
import "react-native-gesture-handler"; // handles complex gestures and interactions, native detects --> js reacts, must be at the top cuz all other imports depend on it.
import Toast from "react-native-toast-message";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider } from "../src/context/ThemeContext";
const toastConfig = {  //creates an object defining custom toast styles for different message types
  success: (props) => ( //when the toast type is success and displays, These are the properties it should display with
    <View
      style={{
        backgroundColor: "#22c55e", /* green background for success messages */
        padding: 16, /* space inside the text box*/
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>
        {props.text1} {/* main message text */}
      </Text>
      <Text style={{ color: "#fff" }}>
        {props.text2} {/* secondary message text */}
      </Text>
    </View>
  )
};


export default function RootLayout() { // root layout for the app, export default makes it the primary component
  return (
    <ThemeProvider> {/* provides theme context to the app, All screens use it so its called first*/}
      <AuthProvider> {/* provides authentication context to the app, The app is personal to all users*/}
        <CartProvider>
          <> {/* provides shopping cart context to the app, All users have a cart, cart depends on authenticated users*/}
          <Stack screenOptions={{ headerShown: false }} /> {/* Stack navigator for managing screen transitions, header is hidden for custom headers*/}
          <Toast config={toastConfig} /> {/* toast component for showing custom pop up messages, Uses custom UI generated from toastConfig */}
          </>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
