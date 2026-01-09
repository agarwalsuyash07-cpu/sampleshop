import { router } from "expo-router"; //navigation
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../src/auth/firebase";
import { AuthContext } from "../src/context/AuthContext";
import { ThemeContext } from "../src/context/ThemeContext";


export default function OrderHistory() { // Order History Screen
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]); // User's orders stored in setOrders
  const [loading, setLoading] = useState(true);// Loading state

  useEffect(() => {
    if (!user) return; // If no user, exit

    const loadOrders = async () => { //async function that fetches user orders from firestore
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc") // Orders sorted by creation date, userID matches the user
      );

      const snap = await getDocs(q); // Get documents from query
      const data = snap.docs.map(doc => ({ //converts firestore docs into plain js objects, adds document ID
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);// Store orders in state
      setLoading(false);// Set loading to false
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return ( // Show loading indicator while fetching orders
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
                key={order.id} // Unique key for each order
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
                {order.items.map((item) => ( //nested list of all the purchased items
                    <Text
                    key={item.id} // Unique key for each item
                    style={{ color: colors.text, opacity: 0.9 }}
                    >
                    • {item.title} × {item.quantity} {/* Display item title and quantity */}
                    </Text>
                ))}
                </View>
            </View>
            ))}

        </ScrollView>
        </SafeAreaView>
  );
}
