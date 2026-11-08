import { useCallback, useState } from "react";
import { View } from "react-native";

import HomePage from "@/components/home-page";
import { Splash } from "@/components/splash";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HomePage />
      {showSplash && <Splash onFinish={handleSplashFinish} />}
    </View>
  );
}
