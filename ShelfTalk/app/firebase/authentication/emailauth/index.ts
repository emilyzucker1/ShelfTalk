import { Router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export async function registerUser(
  email: string,
  password: string,
  username: string,
  router: Router,
) {
  const auth = getAuth();

  try {
    // Create the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update the user's displayName with the provided name
    if (user) {
      await updateProfile(user, { displayName: username });
    }

    // Send a verification email
    alert("Your account has been registered.");

    // Return the created user info
    return userCredential;
  } catch (error) {
    console.error("Error during registration:", error);
    //throw new Error(error.message || "Failed to register user");
  } finally {
    router.replace("./pages/index");
  }
}

export const loginUserwithEmailandPassword = async (
  email: string,
  password: string,
  router: Router,
) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const result = userCredential.user;
    router.replace("/");
  } catch (error) {
    alert("Your username or password is incorrect.");
    console.error("nothing happened");
  }
};

// Fetch protected user data from backend using Firebase ID token for auth.
// NOTE: The fetchUserData helper that used ID tokens to call a protected backend route
// was removed per request. If you want to reintroduce it later, we can add it back.
