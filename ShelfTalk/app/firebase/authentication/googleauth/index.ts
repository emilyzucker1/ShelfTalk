import { Router } from "expo-router";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';


//Configure with Web Client ID (connects to firebase)
// GoogleSignin.configure({
//   webClientId: '601251758069-meikb6an4584ng13khbkaol0taajpb1u.apps.googleusercontent.com',
// });

async function onGoogleButtonPress(router: Router) {
    try{
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider);

        return result;
    }
    catch (err) {
        console.log("Error with Google Sign-In:", err);
    }
    finally {
        router.replace("./pages");
    }

}

export { onGoogleButtonPress };

