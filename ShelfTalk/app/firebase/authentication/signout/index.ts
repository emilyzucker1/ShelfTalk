import { signOut } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { auth } from "../..";

export const signOutUser = async (navigate: NavigateFunction) => {
  try {
    await signOut(auth);
    alert("You have been signed out.");
    navigate("login");
  } catch (error) {
    console.error(error);
  }
};
