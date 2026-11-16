import { Stack } from "expo-router";

import PaymentPage from "@/components/payment";

export default function Payment() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PaymentPage />
    </>
  );
}
