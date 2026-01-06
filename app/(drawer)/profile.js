import { View, Text, Pressable,ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../src/auth/firebase";
import { useContext } from "react";
import { ThemeContext } from "../../src/context/ThemeContext";
import { router } from "expo-router";
import { SafeAreaView} from "react-native-safe-area-context";
import { AuthContext } from "../../src/context/AuthContext";



export default function Profile() {
  const { colors, toggleTheme, theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }
  const email = auth.currentUser?.email || "";
  const initial = email.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
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
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
              {user.email[0].toUpperCase()}
            </Text>
          </View>

          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
            {user.email}
          </Text>
        </View>

        {/* ACCOUNT */}
        <Section title="Account">
          <Row
            label="Your Orders"
            subtitle="Track, return, or buy again"
            onPress={() => router.push("/order-history")}
          />
        </Section>

        {/* PREFERENCES */}
        <Section title="Preferences">
          <Row
            label="Appearance"
            subtitle="Light / Dark mode"
            rightText="Switch"
            onPress={toggleTheme}
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
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
const Section = ({ title, children }) => (
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

const Row = ({ label, subtitle, rightText = "›", onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#374151",
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

