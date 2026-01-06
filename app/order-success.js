import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function OrderSuccess() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Checkmark */}
      <Text style={{ fontSize: 64, marginBottom: 16 }}>✅</Text>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Order Placed!
      </Text>

      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Your order has been placed successfully.
      </Text>

      <Pressable
        onPress={() => router.replace("/(drawer)/products")}
        style={{
          backgroundColor: "#22c55e",
          paddingVertical: 14,
          paddingHorizontal: 30,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          Back to Home
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
