import { Stack } from "expo-router";
import HomePage from "../../components/home-page";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomePage />
    </>
  );
}
