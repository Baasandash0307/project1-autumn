import { useCallback, useState } from "react";
import { View } from "react-native";

import { LoginForm } from "@/components/login-form";
import { Splash } from "@/components/splash";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LoginForm />
      {showSplash && <Splash onFinish={handleSplashFinish} />}
    </View>
  );
}
