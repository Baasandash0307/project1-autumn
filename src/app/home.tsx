import { View } from "react-native";

import { HomePage } from "@/components/home-page";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <HomePage />
    </View>
  );
}
