import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useContext, useState,useEffect } from "react";
import { CartContext } from "../src/context/CartContext";
import { ThemeContext } from "../src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../src/auth/firebase";
import { AuthContext } from "../src/context/AuthContext";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";



export default function Checkout() {
  const { cart, removeItem } = useContext(CartContext);
  const { colors } = useContext(ThemeContext);
  const [addresses, setAddresses] = useState({});
  const [address, setAddress] = useState(null);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;

      const savedAddresses = snap.data().addresses || {};
      setAddresses(savedAddresses);

      const defaultAddr = Object.values(savedAddresses).find(a => a.isDefault);
      if (defaultAddr) setAddress(defaultAddr);
    };

    loadAddresses();
  }, [user]);

  const isFormValid = () => {
    return Object.values(form).every((v) => v.trim() !== "");
  };
  const saveAddress = async () => {
    if (!isFormValid()) {
      Toast.show({
        type: "error",
        text1: "Invalid address",
        text2: "All fields are required",
      });
      return;
    }

    const addressId = uuidv4();

    const newAddress = {
      id: addressId,
      ...form,
      isDefault: true,
    };

    // Remove default from existing addresses
    const updatedAddresses = Object.fromEntries(
      Object.entries(addresses).map(([id, addr]) => [
        id,
        { ...addr, isDefault: false },
      ])
    );

    updatedAddresses[addressId] = newAddress;

    await setDoc(
      doc(db, "users", user.uid),
      { addresses: updatedAddresses },
      { merge: true }
    );

    setAddresses(updatedAddresses);
    setAddress(newAddress);

    Toast.show({
      type: "success",
      text1: "Address saved",
      text2: "Set as default delivery address",
    });
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const placeOrder = async () => {
    if (!address) {
      Toast.show({
        type: "error",
        text1: "Missing address",
        text2: "Please select or add an address",
      });
      return;
    }

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      addressSnapshot: address, // 🔥 snapshot, not reference
      status: "placed",
      createdAt: serverTimestamp(),
    });
    cart.forEach(item => removeItem(item.id));
    Toast.show({
      type: "success",
      text1: "Order placed successfully 🎉",
    });
    router.replace("/order-success");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >       
        {/* 🔙 Back to Cart */}
        <Pressable
          onPress={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: "#3b82f6", fontSize: 16 }}>
            ← Back to Cart
          </Text>
        </Pressable>

        <Text style={{ color: colors.text, fontSize: 22, marginBottom: 12 }}>
          Checkout
        </Text>
        {!address && (
          <>
            {/* 🔁 Saved addresses list (SELECT ADDRESS) */}
            {Object.values(addresses).length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    marginBottom: 12,
                    fontWeight: "600",
                  }}
                >
                  Select Delivery Address
                </Text>

                {Object.values(addresses).map((addr) => (
                  <Pressable
                    key={addr.id}
                    onPress={() => setAddress(addr)}
                    style={{
                      backgroundColor: colors.card,
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 8,
                      borderWidth: addr.isDefault ? 2 : 0,
                      borderColor: "#22c55e",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: "600",
                      }}
                    >
                      {addr.name} {addr.isDefault ? "(Default)" : ""}
                    </Text>

                    <Text style={{ color: colors.text }}>
                      {addr.line1}, {addr.city}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* ➕ Add new address form */}
            <View
              style={{
                backgroundColor: colors.card,
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>
                Add New Address
              </Text>

              {["name", "phone", "line1", "city", "state", "pincode"].map((field) => (
                <TextInput
                  key={field}
                  placeholder={field.toUpperCase()}
                  placeholderTextColor={colors.border}
                  value={form[field]}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, [field]: text }))
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    color: colors.text,
                  }}
                />
              ))}

              <Pressable
                onPress={saveAddress}
                style={{
                  marginTop: 10,
                  paddingVertical: 14,
                  borderRadius: 10,
                  backgroundColor: "#facc15",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "700" }}>Save Address</Text>
              </Pressable>
            </View>
          </>
        )}
        {address && (
          <View
            style={{
              backgroundColor: colors.card,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
                Delivering to {address.name}
              </Text>

              <Text style={{ color: colors.text, marginTop: 6 }}>
                {address.line1}, {address.city}
              </Text>

              <Text style={{ color: colors.text }}>
                {address.state} – {address.pincode}
              </Text>

              <Text style={{ color: colors.text, marginTop: 4 }}>
                Phone: {address.phone}
              </Text>
            </View>

            <Pressable onPress={() => setAddress(null)}>
              <Text style={{ color: "#3b82f6" }}>Change</Text>
            </Pressable>
          </View>
        )}
        {/* Order Summary */}
        {cart.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: colors.card,
              padding: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: colors.text }}>{item.title}</Text>
            <Text style={{ color: colors.text, marginTop: 4 }}>
              ₹ {item.price} × {item.quantity}
            </Text>
          </View>
        ))}

        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            marginTop: 16,
          }}
        >
          Total: ₹ {total.toFixed(2)}
        </Text>

        {/* Place Order */}
        <Pressable
          disabled={!address}
          onPress={placeOrder}
          style={{
            marginTop: 14,
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: address ? "#22c55e" : "#6b7280",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Place Order
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
