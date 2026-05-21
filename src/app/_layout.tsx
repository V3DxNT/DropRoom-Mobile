import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function RootLayout() {
  const { token } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!segments) return;
    const inProtectedGroup = segments[0] === "(tabs)" || segments[0] === "room";

    setTimeout(() => {
      if (!token && inProtectedGroup) {
        console.log("🛑 BOUNCER: No token found. Kicking to Lobby.");
        router.replace("/");
      } else if (token && !inProtectedGroup) {
        console.log("🟢 BOUNCER: Token found. Letting into Tabs.");
        router.replace("/(tabs)");
      }
    }, 10);
    
  }, [token, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}