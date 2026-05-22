import { useEffect } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore"; 

export default function RootLayout() {
  const { token } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();


 useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!token) {
        console.log("🛑 Auth Guard: No token found. Redirecting to login.");
        router.replace('/');
      }
    }, 30);

    return () => clearTimeout(checkAuth);
  }, [token]);
  return <Stack screenOptions={{ headerShown: false }} />;
}