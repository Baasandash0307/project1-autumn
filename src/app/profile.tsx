import { Stack } from "expo-router";

import ProfilePage from "@/components/profile";

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfilePage />
    </>
  );
}
