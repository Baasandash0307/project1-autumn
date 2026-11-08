import { Stack } from "expo-router";

import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginForm />
    </>
  );
}
