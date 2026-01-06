import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../../src/context/CartContext";
import { ThemeContext } from "../../../src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const { colors } = useContext(ThemeContext);
  const { 
    addToCart, 
    increaseQty, 
    decreaseQty, 
    getCartQty 
  } = useContext(CartContext);


  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const qty = getCartQty(product.id);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* IMAGE */}
        <View
          style={{
            backgroundColor: "#fff",
            margin: 12,
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Image
            source={{ uri: product.image }}
            style={{
              width: "100%",
              height: 280,
            }}
            resizeMode="contain"
          />
        </View>

        {/* INFO */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Title */}
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            {product.title}
          </Text>

          {/* Price */}
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            ₹ {product.price}
          </Text>

          {/* Description Card */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* STICKY ADD TO CART */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderColor: colors.border,
        }}
      >
        {qty === 0 ? (
          <Pressable
            onPress={() => {
              addToCart(product);

              Toast.show({
                type: "success",
                text1: "Added to cart",
                text2: product.title,
              });
            }}
            style={{
              backgroundColor: "#22c55e",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              + Add to Cart
            </Text>
          </Pressable>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1f2937",
              borderRadius: 10,
              marginTop: 16,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => {
                decreaseQty(product.id);

                Toast.show({
                  type: "info",
                  text1: "Removed one item",
                });
              }}
              style={{ paddingHorizontal: 20, paddingVertical: 14 }}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>−</Text>
            </Pressable>

            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              {qty}
            </Text>

            <Pressable
              onPress={() => {
                increaseQty(product.id);

                Toast.show({
                  type: "success",
                  text1: "Added one more",
                });
              }}
              style={{ paddingHorizontal: 20, paddingVertical: 14 }}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
