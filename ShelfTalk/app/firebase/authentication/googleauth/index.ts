import { Router } from "expo-router";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { createUserProfile, updateUserProfile } from "../../../backend/user_info";


//Configure with Web Client ID (connects to firebase)
// GoogleSignin.configure({
//   webClientId: '601251758069-meikb6an4584ng13khbkaol0taajpb1u.apps.googleusercontent.com',
// });

async function onGoogleButtonPress(router: Router) {
    try{
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider);

        if (result) {
            await createUserProfile({userID: result.user.uid, email: result.user.email, username: result.user.displayName || `user${result.user.uid.slice(0, 6)}`});
            await updateUserProfile(result.user.uid, {photoURL: result.user.photoURL});
        }

        return result;
    }
    catch (err) {
        console.log("Error with Google Sign-In:", err);
    }
    finally {
        router.replace("/");
    }

}

export { onGoogleButtonPress };

