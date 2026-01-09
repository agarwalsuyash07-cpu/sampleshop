import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { getProducts } from "../../../src/api/products";
import { CartContext } from "../../../src/context/CartContext";
import { ThemeContext } from "../../../src/context/ThemeContext";

export default function Products() { //define and export the Products component
  const [products, setProducts] = useState([]); //Holds the list of products fetched from the API
  const [query, setQuery] = useState(""); //Holds the current search query entered by the user
  const { colors } = useContext(ThemeContext);
  useEffect(() => { //fetch products when the component has been created and added to UI
    getProducts().then(setProducts); 
  }, []);
  const { width } = Dimensions.get("window"); //get device screen width
  const GAP = 8; //space between product cards
  const { cart, addToCart, increaseQty,decreaseQty,getCartQty} = useContext(CartContext);
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity, // calcs total no of items in cart for the cart icon top right
    0
  );
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2; //decides on number of cards based on screen width, 4 of desktop, 2 or phones

  const CARD_SIZE =
    (width - 12 * 2 - GAP * (numColumns - 1)) / numColumns; //card size based on screen width, padding and gaps


  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) //filter mechanism when a search query is entered
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row", //horizontal layout of search bar and cart button
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

            {cartCount > 0 && ( //shows and amt badge only if cart has items
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
        data={filtered} //data source for the list, uses filtered products based on search query
        keyExtractor={(item) => item.id.toString()} //unique key for each product
        numColumns={numColumns}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: GAP,
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false} //hides scroll wheel
        renderItem={({ item }) => { //how each product card is rendered
          const qty = getCartQty(item.id); //get current quantity of this item in cart
          return(
            <Pressable
              onPress={() => router.push(`/(drawer)/products/${item.id}`)} //re-routes to product details page on press
              style={{
                width: CARD_SIZE,
                backgroundColor: colors.card,
                borderRadius: 10,
                padding: 8,
              }}
            >
              {/* Image */}
              <Image
                source={{ uri: item.image }} //gets product image from API
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
                {qty === 0 ? ( // if quantity on cart is 0, it shows add to cart button in green style.
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation(); //prevents opening product page
                      addToCart(item);

                      Toast.show({
                        type: "success",
                        text1: "Added to cart",
                        text2: item.title,
                      }); //toast message on adding to cart
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
                        decreaseQty(item.id); //removes item from cart when "-" is pressed

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
                      {qty} {/*shows current quantity in cart*/}
                    </Text>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        increaseQty(item.id); //adds one more item to cart when "+" is pressed

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
