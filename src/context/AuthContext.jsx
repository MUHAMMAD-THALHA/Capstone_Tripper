import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    setUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      authMethod: "google"
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        authMethod: "google"
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Google login error:", error);
    return { success: false, error: error.message };
  }
}; 