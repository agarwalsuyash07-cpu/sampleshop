import { router } from "expo-router"; //navigation
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase auth function
import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../src/auth/firebase";
import { ThemeContext } from "../src/context/ThemeContext";

export default function Signup() {
  const { colors } = useContext(ThemeContext);
  const [email, setEmail] = useState(""); // User email state
  const [password, setPassword] = useState(""); // User password state

  const [emailError, setEmailError] = useState(""); // Email error state
  const [passwordError, setPasswordError] = useState(""); // Password error state

  const signup = async () => { //async function to handle user signup
    let valid = true; //flag to check if form is in proper order
    setEmailError("");
    setPasswordError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address.");
      valid = false; // email is not valid. changes flag to false
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false; // if password if empty, flag is false
    }

    if (!valid) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password); //pushes info to database
      router.replace("/(drawer)/products"); //if all details are valid, re route to products page
    } catch (err) {
      if (err.code === "auth/email-already-in-use") { //if email is already in use
        setEmailError("Email already in use.");
      } else {
        setPasswordError("Signup failed. Try again."); //server error
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
