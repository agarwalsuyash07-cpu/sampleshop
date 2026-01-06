import { View, TextInput, FlatList, Text, Pressable, Dimensions } from "react-native";
import { useEffect, useState, useContext } from "react";
import { getProducts } from "../../../src/api/products";
import { router } from "expo-router";
import { ThemeContext } from "../../../src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "../../../src/context/CartContext";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const { colors } = useContext(ThemeContext);
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  const { width } = Dimensions.get("window");
  const GAP = 8;
  const { cart, addToCart, increaseQty,decreaseQty,getCartQty} = useContext(CartContext);
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
// Decide columns based on screen width
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  const CARD_SIZE =
    (width - 12 * 2 - GAP * (numColumns - 1)) / numColumns;


  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 12,
          gap: 12,
        }}
      >
        {/* Search */}
        <TextInput
          placeholder="Search products"
          placeholderTextColor={colors.border}
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
          }}
        />

        {/* Cart Button */}
        <Pressable onPress={() => router.push("/cart")}>
          <View>
            <Text style={{ fontSize: 22 }}>🛒</Text>

            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "#ef4444",
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
      {/* Product List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: GAP,
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const qty = getCartQty(item.id);
          return(
            <Pressable
              onPress={() => router.push(`/(drawer)/products/${item.id}`)}
              style={{
                width: CARD_SIZE,
                backgroundColor: colors.card,
                borderRadius: 10,
                padding: 8,
              }}
            >
              {/* Image */}
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: CARD_SIZE - 70,
                  borderRadius: 8,
                  marginBottom: 6,
                  backgroundColor: "#fff"
                }}
                resizeMode="contain"
              />


              {/* Bottom row: text + cart button */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                {/* Text section */}
                <View style={{ flex: 1, paddingRight: 6 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: colors.text,
                      fontSize: 11,
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    ₹ {item.price}
                  </Text>
                </View>

                {/* Add to Cart button */}
                {qty === 0 ? (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation(); // 🔴 prevents opening product page
                      addToCart(item);

                      Toast.show({
                        type: "success",
                        text1: "Added to cart",
                        text2: item.title,
                      });
                    }}
                    style={{
                      backgroundColor: "#22c55e",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      + Cart
                    </Text>
                  </Pressable>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#1f2937",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        decreaseQty(item.id);

                        Toast.show({
                          type: "info",
                          text1: "Item removed",
                        });
                      }}
                      style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 18 }}>−</Text>
                    </Pressable>

                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      {qty}
                    </Text>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        increaseQty(item.id);

                        Toast.show({
                          type: "success",
                          text1: "Added one more",
                        });
                      }}
                      style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </Pressable>
        )}}
      />
    </SafeAreaView>
  );
}
