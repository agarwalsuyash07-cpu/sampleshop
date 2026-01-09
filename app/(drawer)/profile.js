import { router } from "expo-router"; // navigation 
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../src/auth/firebase";
import { AuthContext } from "../../src/context/AuthContext";
import { ThemeContext } from "../../src/context/ThemeContext";



export default function Profile() {  //profile screen component,  
  const { colors, toggleTheme, theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  if (!user) { // if user is not logged in, show empty screen
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }
  const email = auth.currentUser?.email || ""; //takes user email
  const initial = email.charAt(0).toUpperCase(); //first letter of email for profile pic

  const handleLogout = async () => { // logout function
    await signOut(auth);
    router.replace("/login"); //redirect to login screen
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#3b82f6",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10, //avatar circle with first letter of email
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
              {user.email[0].toUpperCase()} 
            </Text> {/* Display first letter of user's email in CAPS as profile pic */}
          </View>

          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
            {user.email} {/* Display user's email address  */}
          </Text>
        </View>

        {/* ACCOUNT */}
        <Section title="Account">
          <Row
            label="Your Orders"
            subtitle="Track, return, or buy again"
            onPress={() => router.push("/order-history")} //switches to order history screen when clicked on the row
          />
        </Section>

        {/* PREFERENCES */}
        <Section title="Preferences">
          <Row
            label="Appearance"
            subtitle="Light / Dark mode" 
            rightText="Switch"
            onPress={toggleTheme} //toggles theme between light and dark mode
          />
        </Section>

        {/* LOGOUT */}
        <Pressable
          onPress={handleLogout}
          style={{
            marginTop: 24,
            backgroundColor: "#ef4444",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Logout
          </Text>
        </Pressable> {/*log's out the user on clicking the button */}

      </ScrollView>
    </SafeAreaView>
  );
}
const Section = ({ title, children }) => ( //used to group rows visually
  <View style={{ marginBottom: 20 }}>
    <Text
      style={{
        color: "#9ca3af",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
      }}
    >
      {title}
    </Text>

    <View
      style={{
        backgroundColor: "#1f2937",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  </View>
);

const Row = ({ label, subtitle, rightText = "›", onPress }) => ( //row component, clickable list item that spans the entire width of the screen
  <Pressable
    onPress={onPress}
    style={{
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#374151", // grey background
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
        {label}
      </Text>

      {subtitle && (
        <Text style={{ color: "#9ca3af", marginTop: 2 }}>
          {subtitle}
        </Text>
      )}
    </View>

    <Text style={{ color: "#9ca3af", fontSize: 18 }}>
      {rightText}
    </Text>
  </Pressable>
);

