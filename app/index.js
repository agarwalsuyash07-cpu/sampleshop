import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";

export default function Index() {
  const { user } = useContext(AuthContext);
  return <Redirect href={user ? "/(tabs)/products" : "/login"} />;

}
