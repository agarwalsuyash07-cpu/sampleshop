import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth"; //firebase email/password login
import { useContext, useState } from "react";
import {
  ActivityIndicator, // loading indicator
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../src/auth/firebase";
import { ThemeContext } from "../src/context/ThemeContext";

export default function Login() { //login function
  const { colors } = useContext(ThemeContext);
  const [email, setEmail] = useState(""); //stores the email in setemail
  const [password, setPassword] = useState(""); //stores password in setpassword
  const [loading, setLoading] = useState(false); //loading state
  const [emailError, setEmailError] = useState(""); //field error
  const [passwordError, setPasswordError] = useState("");//field error

  const login = async () => {
    if (loading) return; // prevent double click

    let valid = true;
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Invalid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) return;

    try {
      setLoading(true); // START loading

      await signInWithEmailAndPassword(auth, email, password);

      router.replace("/(drawer)/products");
    } catch (err) {
      // Firebase error mapping
      if (err.code === "auth/user-not-found") {
        setEmailError("No account found with this email."); //invalid email error
      } else if (err.code === "auth/wrong-password") {
        setPasswordError("Incorrect password.");//invalid password error
      } else {
        setPasswordError("Login failed. Try again.");//generic error
      }
    } finally {
      setLoading(false); // STOP loading (success OR error)
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined} //checks for platform OS, if IOS use padding else leave it
    >
      <View
        style={{
          width: "100%",
          maxWidth: 380,
          backgroundColor: colors.card, // login card
          borderRadius: 14,
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "600", color: colors.text, textAlign: "center" }}>
          Login
        </Text>

        {/* Email */}
        <Text style={{ color: colors.text, marginTop: 20 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none" 
          placeholder="name@example.com"
          placeholderTextColor={colors.border}
          style={{
            borderWidth: 1,
            borderColor: emailError ? "#ef4444" : colors.border,
            borderRadius: 10,
            padding: 12,
            color: colors.text,
          }} //email input
        />
        {emailError ? <Text style={{ color: "#ef4444", marginTop: 4 }}>{emailError}</Text> : null} {/*if error in email, highlight with red text, else let through */}

        {/* Password */}
        <Text style={{ color: colors.text, marginTop: 14 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.border}
          style={{
            borderWidth: 1,
            borderColor: passwordError ? "#ef4444" : colors.border, 
            borderRadius: 10,
            padding: 12,
            color: colors.text,
          }}
        />
        {passwordError ? <Text style={{ color: "#ef4444", marginTop: 4 }}>{passwordError}</Text> : null} {/*same for password */}

        <Pressable
          onPress={login}
          disabled={loading}
          style={{
            marginTop: 20,
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: loading ? "#9ca3af" : "#22c55e", //if loading switch to gray or else keep green
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" /> //loading indicator while logging in, color of dots is white
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Login
            </Text>
          )}
        </Pressable>
        <Pressable onPress={() => router.push("/signup")} style={{ marginTop: 18 }}>
          <Text style={{ textAlign: "center", color: colors.text }}>
            Don’t have an account? <Text style={{ color: "#3b82f6" }}>Sign up</Text> {/*if no account, will reroute to signup page when clicked */}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
