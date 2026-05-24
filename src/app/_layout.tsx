import { useEffect } from "react";
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!token) {
        console.log("No Existing Credentials");
        router.replace("/");
      }
    }, 30);

    return () => clearTimeout(checkAuth);
  }, [token]);
  return (
    <KeyboardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </KeyboardProvider>
  );
}
