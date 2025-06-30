import { createContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user and their role from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setRole(data.role ?? "user"); // fallback to 'user'
          } else {
              // Automatically create user doc if not exists
              await setDoc(userDocRef, {
                email: firebaseUser.email,
                role: "user", // default role
                createdAt: new Date()
              });
              setRole("user");
          }
        } catch (err) {
          console.error("[AuthContext] Failed to fetch user role:", err);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memoized context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === "admin"
  }), [user, role, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
