import { Redirect } from "expo-router"; //sends user to another route
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";

export default function Index() { // app entry point
  const { user } = useContext(AuthContext); // checks if user is logged in
  return <Redirect href={user ? "/(drawer)/products" : "/login"} />; // if user is logged in send to products page, or else send to login page
}
