import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/auth/firebase";
import { useState, useContext } from "react";
import { router } from "expo-router";
import { ThemeContext } from "../src/context/ThemeContext";

export default function Login() {
  const { colors } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address.");
      valid = false;
    }

    // Password empty
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(drawer)/products");
    } catch (err) {
      // Firebase error mapping
      if (err.code === "auth/user-not-found") {
        setEmailError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setPasswordError("Incorrect password.");
      } else {
        setPasswordError("Login failed. Try again.");
      }
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 380,
          backgroundColor: colors.card,
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
          }}
        />
        {emailError ? <Text style={{ color: "#ef4444", marginTop: 4 }}>{emailError}</Text> : null}

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
        {passwordError ? <Text style={{ color: "#ef4444", marginTop: 4 }}>{passwordError}</Text> : null}

        <Pressable
          onPress={login}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/signup")} style={{ marginTop: 18 }}>
          <Text style={{ textAlign: "center", color: colors.text }}>
            Don’t have an account? <Text style={{ color: "#3b82f6" }}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
