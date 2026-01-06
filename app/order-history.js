import { View, Text, FlatList, Pressable,ScrollView} from "react-native";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../src/auth/firebase";
import { AuthContext } from "../src/context/AuthContext";
import { ThemeContext } from "../src/context/ThemeContext";
import { router } from "expo-router";


export default function OrderHistory() {
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>Loading orders...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>

            {/* BACK TO HOME */}
            <Pressable
            onPress={() => router.replace("/(drawer)/products")}
            style={{
                alignSelf: "flex-start",
                backgroundColor: "#2563eb",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                marginBottom: 16,
            }}
            >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
                ← Back to Home
            </Text>
            </Pressable>

            <Text
            style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: "700",
                marginBottom: 16,
            }}
            >
            Your Orders
            </Text>

            {orders.map((order) => (
            <View
                key={order.id}
                style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                padding: 16,
                marginBottom: 14,
                }}
            >
                {/* HEADER */}
                <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                }}
                >
                <Text style={{ color: colors.text, fontWeight: "700" }}>
                    Order #{order.id.slice(0, 6)}
                </Text>

                <Text style={{ color: "#22c55e", fontWeight: "600" }}>
                    {order.status}
                </Text>
                </View>

                <Text style={{ color: colors.text, opacity: 0.7 }}>
                Total: ₹ {order.total.toFixed(2)}
                </Text>

                <View style={{ marginTop: 10 }}>
                {order.items.map((item) => (
                    <Text
                    key={item.id}
                    style={{ color: colors.text, opacity: 0.9 }}
                    >
                    • {item.title} × {item.quantity}
                    </Text>
                ))}
                </View>
            </View>
            ))}

        </ScrollView>
        </SafeAreaView>

  );
}
