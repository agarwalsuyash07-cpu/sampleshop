import { createContext, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // "light" | "dark"
  const [theme, setTheme] = useState(systemTheme || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "dark"
    ? {
        background: "#0f172a",
        card: "#1e293b",
        text: "#f8fafc",
        border: "#334155",
      }
    : {
        background: "#ffffff",
        card: "#f1f5f9",
        text: "#020617",
        border: "#cbd5e1",
      };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
