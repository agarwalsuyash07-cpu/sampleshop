import { createContext, useState } from "react";
import { useColorScheme } from "react-native"; // detects system theme

export const ThemeContext = createContext(); //creating context object, allows to read theme, toggle theme,etc

export const ThemeProvider = ({ children }) => {// wrapper compnent, children= everything wrapped inside ThemeProvider
  const systemTheme = useColorScheme(); // "light" | "dark"
  const [theme, setTheme] = useState(systemTheme || "light"); // initial theme based on system preference. if not available, default to "light"

  const toggleTheme = () => { //function to toggle between light and dark themes
    setTheme((prev) => (prev === "light" ? "dark" : "light")); //checks previous theme appies opposite theme
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
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}> {/*calling function to provide theme, colors, toggleTheme to children components*/}
      {children}
    </ThemeContext.Provider>
  );
};
