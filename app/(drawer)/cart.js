import { View, Text, FlatList, Pressable } from "react-native";
import { useContext } from "react";
import { CartContext } from "../../src/context/CartContext";
import { ThemeContext } from "../../src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Image } from "react-native";


const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_LARGE_SCREEN = SCREEN_WIDTH >= 900; // web / tablet


export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } =
    useContext(CartContext);
  const { colors } = useContext(ThemeContext);
  const qtyBtnStyle = (colors) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
  });


  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
        <View style={{ flex: IS_LARGE_SCREEN ? 2 : 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12 }}>
            Shopping Cart
          </Text>

          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.card,
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 14,
                }}
              >
                {/* Product Image */}
                <Image
                  source={{ uri: item.image }}
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
                      <Text style={{ color: colors.text }}>−</Text>
                    </Pressable>

                    <Text style={{ marginHorizontal: 12, color: colors.text }}>
                      {item.quantity}
                    </Text>

                    <Pressable
                      onPress={() => increaseQty(item.id)}
                      style={qtyBtnStyle(colors)}
                    >
                      <Text style={{ color: colors.text }}>+</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => removeItem(item.id)}
                      style={{ marginLeft: 20 }}
                    >
                      <Text style={{ color: "#ef4444" }}>Delete</Text>
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
            Subtotal ({cart.length} items)
          </Text>

          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 14,
            }}
          >
            ₹ {subtotal.toFixed(2)}
          </Text>

          <Pressable
            onPress={() => router.push("/checkout")}
            style={{
              paddingVertical: 14,
              borderRadius: 10,
              backgroundColor: "#facc15", // Amazon-ish
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
