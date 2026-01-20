import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RootRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, []);

    return null;
}



