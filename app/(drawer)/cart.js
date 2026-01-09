import { router } from "expo-router";
import { useContext } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "../../src/context/CartContext";
import { ThemeContext } from "../../src/context/ThemeContext";


const SCREEN_WIDTH = Dimensions.get("window").width; //window width
const IS_LARGE_SCREEN = SCREEN_WIDTH >= 900; // web / tablet


export default function Cart() { //define and export the Cart component
  const { cart, increaseQty, decreaseQty, removeItem } =
    useContext(CartContext);
  const { colors } = useContext(ThemeContext);
  const qtyBtnStyle = (colors) => ({ //quantity button style bellow product image
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
  });


  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, //shows the total cost of current cart.
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          flexDirection: IS_LARGE_SCREEN ? "row" : "column",
          padding: 20,
          gap: 20,
        }}
      >
        {/* LEFT: CART ITEMS */}
        <View style={{ flex: IS_LARGE_SCREEN ? 2 : 1 }}> {/* takes more space on large screens, full width on small screens */}
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12 }}>
            Shopping Cart
          </Text>

          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()} // unique key for each item
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => ( // how each item in the cart is displayed
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.card,
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 14,
                }} //item card
              >
                {/* Product Image */}
                <Image
                  source={{ uri: item.image }} //universal resource identifier
                  resizeMode="contain"
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginRight: 14,
                  }}
                />
                {/* Product Info */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text style={{ color: colors.text, marginTop: 4 }}>
                    ₹ {item.price}
                  </Text>

                  {/* Quantity Controls */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      onPress={() => decreaseQty(item.id)}
                      style={qtyBtnStyle(colors)}
                    >
                      <Text style={{ color: colors.text }}>−</Text> {/*decreases quantity of this item when clicked and in cart*/}
                    </Pressable>

                    <Text style={{ marginHorizontal: 12, color: colors.text }}>
                      {item.quantity}
                    </Text>

                    <Pressable
                      onPress={() => increaseQty(item.id)}
                      style={qtyBtnStyle(colors)}
                    >
                      <Text style={{ color: colors.text }}>+</Text> {/*increases quantity of this item when clicked and in cart*/}
                    </Pressable>

                    <Pressable
                      onPress={() => removeItem(item.id)}
                      style={{ marginLeft: 20 }}
                    >
                      <Text style={{ color: "#ef4444" }}>Delete</Text> {/*removes this item from cart when clicked*/}
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        {/* RIGHT: SUMMARY */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 14,
            padding: 16,
            height: "fit-content",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18, marginBottom: 8 }}>
            Subtotal ({cart.length} items) {/*shows number of items in cart*/}
          </Text>

          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 14,
            }}
          >
            ₹ {subtotal.toFixed(2)} {/*shows total cost of items in cart with 2 decimal places*/}
          </Text>

          <Pressable
            onPress={() => router.push("/checkout")} //navigates to checkout screen on press
            style={{
              paddingVertical: 14,
              borderRadius: 10,
              backgroundColor: "#facc15", 
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700" }}>Proceed to Buy</Text>
          </Pressable>

          <View
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              backgroundColor: colors.background,
            }}
          >
            <Text style={{ color: colors.text }}>
              Secure Checkout
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
