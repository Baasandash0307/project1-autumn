import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Button, ButtonText } from "@/components/ui/button";

type Screen = "choice" | "login" | "register";

export function LoginForm() {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const player = useVideoPlayer(
    require("../../assets/videos/burger-background.mp4"),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  const handleSubmit = () => {
    // Login / register API-гаа энд холбоно.
    router.replace("/home");
  };

  const changeScreen = (next: Screen) => {
    setFocused(null);
    setScreen(next);
  };

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.85)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <KeyboardAvoidingView
        style={styles.foreground}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.panel}>
            {screen === "choice" ? (
              <View style={styles.choice}>
                <Button
                  className="h-14 w-full rounded-xl bg-white"
                  onPress={() => changeScreen("login")}
                >
                  <ButtonText className="text-base font-semibold text-black">
                    Login
                  </ButtonText>
                </Button>

                <Button
                  className="h-14 w-full rounded-xl"
                  style={styles.outlineButton}
                  onPress={() => changeScreen("register")}
                >
                  <ButtonText className="text-base font-semibold text-white">
                    Create account
                  </ButtonText>
                </Button>
              </View>
            ) : (
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    focused === "email" && styles.inputFocused,
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor="#FFFFFF"
                />

                <TextInput
                  style={[
                    styles.input,
                    focused === "password" && styles.inputFocused,
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor="#FFFFFF"
                />

                <Button
                  className="mt-2 h-14 w-full rounded-xl bg-white"
                  onPress={handleSubmit}
                >
                  <ButtonText className="text-base font-semibold text-black">
                    {screen === "login" ? "Sign in" : "Create account"}
                  </ButtonText>
                </Button>

                <Button variant="ghost" onPress={() => changeScreen("choice")}>
                  <ButtonText className="text-sm font-normal text-white">
                    Back
                  </ButtonText>
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  foreground: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  panel: {
    width: "100%",
    maxWidth: 380,
  },
  choice: {
    gap: 16,
  },
  form: {
    gap: 14,
  },
  outlineButton: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  input: {
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 0,
    fontSize: 15,
    fontWeight: "400",
    color: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  inputFocused: {
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
