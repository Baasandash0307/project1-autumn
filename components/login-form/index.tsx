import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";

type Screen = "choice" | "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const handleLogin = () => {
    console.log("login", { email, password });
    router.replace("/home");
  };

  const handleRegister = () => {
    console.log("register", { email, password });
    router.replace("/home");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F03241"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 0.6 }}
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/burger1.png")}
        style={styles.burger}
        resizeMode="contain"
      />

      <View className="z-10 w-full max-w-sm flex-1 justify-center mt-150 py-12">
        {screen === "choice" && (
          <View className="gap-5">
            <Button
              className="h-14 w-full rounded-2xl bg-white"
              onPress={() => setScreen("login")}
            >
              <ButtonText className="text-base font-semibold text-[#EF2A39]">
                Login
              </ButtonText>
            </Button>

            <Button
              className="h-14 w-full rounded-2xl"
              style={styles.outlineButton}
              onPress={() => setScreen("register")}
            >
              <ButtonText className="text-base font-semibold text-white">
                Create account
              </ButtonText>
            </Button>
          </View>
        )}

        {screen === "login" && (
          <View className="gap-3">
            <TextInput
              className="rounded-2xl px-4 py-4 text-base text-neutral-900"
              style={[styles.input, focused === "email" && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="Email"
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              className="rounded-2xl px-4 py-4 text-base text-neutral-900"
              style={[
                styles.input,
                focused === "password" && styles.inputFocused,
              ]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
            />

            <Button
              className="mt-3 h-14 w-full rounded-2xl bg-white"
              onPress={handleLogin}
            >
              <ButtonText className="text-base font-semibold text-[#EF2A39]">
                Sign in
              </ButtonText>
            </Button>

            <Button variant="ghost" onPress={() => setScreen("choice")}>
              <ButtonText className="text-white">Back</ButtonText>
            </Button>
          </View>
        )}

        {screen === "register" && (
          <View className="gap-3">
            <TextInput
              className="rounded-2xl px-4 py-4 text-base text-neutral-900"
              style={[styles.input, focused === "email" && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="Email"
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              className="rounded-2xl px-4 py-4 text-base text-neutral-900"
              style={[
                styles.input,
                focused === "password" && styles.inputFocused,
              ]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
            />

            <Button
              className="mt-3 h-14 w-full rounded-2xl bg-white"
              onPress={handleRegister}
            >
              <ButtonText className="text-base font-semibold text-[#EF2A39]">
                Create account
              </ButtonText>
            </Button>

            <Button variant="ghost" onPress={() => setScreen("choice")}>
              <ButtonText className="text-white">Back</ButtonText>
            </Button>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  burger: {
    position: "absolute",
    left: -40,
    bottom: -20,
    width: 350,
    height: 350,
    zIndex: 0,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inputFocused: {
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.14,
  },
});
