import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/auth/firebase";
import { useState, useContext } from "react";
import { router } from "expo-router";
import { ThemeContext } from "../src/context/ThemeContext";

export default function Signup() {
  const { colors } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const signup = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address.");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    if (!valid) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(drawer)/products");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setEmailError("Email already in use.");
      } else {
        setPasswordError("Signup failed. Try again.");
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
          Sign Up
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
          placeholder="Minimum 6 characters"
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
          onPress={signup}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Create Account</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 18 }}>
          <Text style={{ textAlign: "center", color: colors.text }}>
            Already have an account? <Text style={{ color: "#3b82f6" }}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
