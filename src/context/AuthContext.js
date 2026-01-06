import { createContext, useEffect, useState } from "react"; //importing react hooks
import { onAuthStateChanged } from "firebase/auth"; // importing firebase auth state change listener
import { auth } from "../auth/firebase"; //importing configured firebase auth instances

export const AuthContext = createContext(); //creates context object, no data but a place to store it

export const AuthProvider = ({ children }) => { //provider component that wraps around parts of the app needing auth data, data source,children are data inside provider
  const [user, setUser] = useState(null); //stores current user info
  const [loading, setLoading] = useState(true); //tracks if auth state is being checked

  useEffect(() => { 
    const unsub = onAuthStateChanged(auth, (u) => { //listener for auth state changes
      setUser(u); //global user state updated
      setLoading(false); //loading complete
    });
    return unsub; //stop talking to firebase on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}> {/* provides user and loading state to children components */}
      {children}
    </AuthContext.Provider>
  );
};
