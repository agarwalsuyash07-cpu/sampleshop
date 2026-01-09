import { router } from "expo-router"; // allows navigation between different screens in the app
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"; //firebase functions for database operations
import { useContext, useEffect, useState } from "react"; //useeffect for user changes, usestate for local state management, usecontext for accessing global contexts
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid"; //for generating unique ids for addressses 
import { db } from "../src/auth/firebase";
import { AuthContext } from "../src/context/AuthContext";
import { CartContext } from "../src/context/CartContext";
import { ThemeContext } from "../src/context/ThemeContext";
export default function Checkout() { //defines and exports the checkout component
  const { cart, removeItem } = useContext(CartContext); // access cart and removeItem function from CartContext
  const { colors } = useContext(ThemeContext); // access theme colors from ThemeContext
  const [addresses, setAddresses] = useState({}); // local state to store user addresses inside of setAddresses
  const [address, setAddress] = useState(null); // local state to store selected address inside of setAddress
  const { user } = useContext(AuthContext); // access authenticated user from AuthContext
  useEffect(() => { // load saved addresses when user changes
    if (!user) return; //returns empty value if user not loaded yet
    const loadAddresses = async () => { // async function to load addresses from firestore
      const snap = await getDoc(doc(db, "users", user.uid)); //reads user document from firestore
      if (!snap.exists()) return; // if no document exists, exit function
      const savedAddresses = snap.data().addresses || {}; // get addresses from document data or empty object
      setAddresses(savedAddresses); //store all addresses in state
      const defaultAddr = Object.values(savedAddresses).find(a => a.isDefault);// find default address
      if (defaultAddr) setAddress(defaultAddr); // auto select default address if it exists
    };
    loadAddresses();
  }, [user]); //execute once user is loaded/changes
  const isFormValid = () => {
    return Object.values(form).every((v) => v.trim() !== "");
  }; // checks if all form fields are filled
  const saveAddress = async () => { // called when user clicks save address button
    if (!isFormValid()) {
      Toast.show({
        type: "error",
        text1: "Invalid address",
        text2: "All fields are required",
      }); //checks if form is invalid, if invalid shows error toast
      return;
    }
    const addressId = uuidv4(); //genereates unique id for new address
    const newAddress = {
      id: addressId,
      ...form,
      isDefault: true,
    };// creates new address object with form data and sets it as default

    // Remove default from existing addresses
    const updatedAddresses = Object.fromEntries(
      Object.entries(addresses).map(([id, addr]) => [
        id,
        { ...addr, isDefault: false },
      ])
    );

    updatedAddresses[addressId] = newAddress; // adds new address to updated addresses list
    await setDoc( // saves updated addresses to firestore without overwriting other user data
      doc(db, "users", user.uid),
      { addresses: updatedAddresses },
      { merge: true }
    );
    setAddresses(updatedAddresses); //updates local addresses state
    setAddress(newAddress); // sets newly added address as selected address
    Toast.show({
      type: "success",
      text1: "Address saved",
      text2: "Set as default delivery address",
    }); // toast message for successful address save
  };
  const [form, setForm] = useState({
    name: "",phone: "",line1: "",city: "",state: "",pincode: "",
  });
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, // total cart cost calculation
    0
  );
  const placeOrder = async () => { // called when user clicks place order button
    if (!address) {
      Toast.show({
        type: "error",
        text1: "Missing address",
        text2: "Please select or add an address",
      });
      return;
    }// checks if address is selected, if not shows error toast
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),// after ordered is placed, adds order document to firestore with user id, cart items, total amount, address snapshot, status and timestamp
      total,
      addressSnapshot: address, 
      status: "placed",
      createdAt: serverTimestamp(), //shows the status of the order as placed and adds server timestamp
    }); 
    cart.forEach(item => removeItem(item.id));//clears cart after order is placed
    Toast.show({
      type: "success",
      text1: "Order placed successfully 🎉",
    });
    router.replace("/order-success"); //re-routes to order success screen
  };
  return ( //styling and layout of checkout screen
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false} //hides scrollbar for cleaner look
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
            {Object.values(addresses).length > 0 && ( //checks if there are saved addresses
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
                {Object.values(addresses).map((addr) => ( //maps through saved addresses and displays them
                  <Pressable
                    key={addr.id} //unique key for each address
                    onPress={() => setAddress(addr)} //sets selected address on press
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
                      {addr.name} {addr.isDefault ? "(Default)" : ""} {/* shows name and indicates if default*/}
                    </Text>
                    <Text style={{ color: colors.text }}>
                      {addr.line1}, {addr.city} {/* shows address line 1 and city */}
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
                  placeholder={field.toUpperCase()} // shows field name in uppercase as placeholder
                  placeholderTextColor={colors.border}
                  value={form[field]}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, [field]: text })) // updates form state on text change
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
        {address && ( // displays selected address details
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
            <Pressable onPress={() => setAddress(null)}> {/* allows changing the selected address */}
              <Text style={{ color: "#3b82f6" }}>Change</Text>
            </Pressable>
          </View>
        )}
        {/* Order Summary */}
        {cart.map((item) => ( //maps through cart items and displays them
          <View
            key={item.id} //unique key for each cart item
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
