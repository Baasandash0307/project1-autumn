import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Screen = "choice" | "login" | "register";

export function LoginForm() {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const [error, setError] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const entrance = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(
    require("../../assets/videos/burger-background.mp4"),
    (video) => {
      video.loop = true;
      video.muted = true;
      video.play();
    },
  );

  useEffect(() => {
    entrance.setValue(0);

    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [screen, entrance]);

  const changeScreen = (next: Screen) => {
    Keyboard.dismiss();
    setFocused(null);
    setError("");
    setShowPassword(false);
    setPassword("");
    setScreen(next);
  };

  const handleSubmit = () => {
    const cleanEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Зөв имэйл хаяг оруулна уу.");
      return;
    }

    if (!password) {
      setError("Нууц үгээ оруулна уу.");
      return;
    }

    if (screen === "register" && password.length < 8) {
      setError("Нууц үг хамгийн багадаа 8 тэмдэгт байна.");
      return;
    }

    Keyboard.dismiss();
    setError("");

    // Одоогоор demo: энд login / register API-гаа холбоно.
    router.replace("/home");
  };

  const isLogin = screen === "login";

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
        colors={[
          "rgba(0,0,0,0.08)",
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.78)",
          "rgba(0,0,0,0.96)",
        ]}
        locations={[0, 0.32, 0.68, 1]}
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
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.panel,
              {
                opacity: entrance,
                transform: [
                  {
                    translateY: entrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.intro}>
              <View style={styles.badge}>
                <View style={styles.dot} />
                <Text style={styles.badgeText}>GOOD FOOD. GOOD MOOD.</Text>
              </View>

              <Text style={styles.title}>
                {screen === "choice"
                  ? "Foodie"
                  : isLogin
                    ? "Welcome\nback."
                    : "Make it\nyours."}
              </Text>

              <Text style={styles.subtitle}>
                {screen === "choice"
                  ? "Something delicious is waiting for you."
                  : isLogin
                    ? "Sign in. Your favorites are waiting."
                    : "Create an account and find your favorites."}
              </Text>
            </View>

            {screen === "choice" ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => changeScreen("login")}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryText}>Let’s get started</Text>
                <Text style={styles.primaryArrow}>↗</Text>
              </Pressable>
            ) : (
              <View style={styles.card}>
                <View style={styles.form}>
                  <View style={styles.tabs}>
                    {(["login", "register"] as const).map((tab) => (
                      <Pressable
                        key={tab}
                        accessibilityRole="tab"
                        accessibilityState={{
                          selected: screen === tab,
                        }}
                        onPress={() => {
                          if (screen !== tab) changeScreen(tab);
                        }}
                        style={[styles.tab, screen === tab && styles.activeTab]}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            screen === tab && styles.activeTabText,
                          ]}
                        >
                          {tab === "login" ? "Login" : "Register"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Email address</Text>

                    <View
                      style={[
                        styles.inputWrapper,
                        focused === "email" && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        accessibilityLabel="Email address"
                        value={email}
                        onChangeText={(value) => {
                          setEmail(value);
                          setError("");
                        }}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        placeholder="you@example.com"
                        placeholderTextColor="#74777F"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        selectionColor="#FFFFFF"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                      />
                    </View>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>

                    <View
                      style={[
                        styles.inputWrapper,
                        focused === "password" && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        ref={passwordRef}
                        style={styles.input}
                        accessibilityLabel="Password"
                        value={password}
                        onChangeText={(value) => {
                          setPassword(value);
                          setError("");
                        }}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                        placeholder={
                          isLogin
                            ? "Enter your password"
                            : "At least 8 characters"
                        }
                        placeholderTextColor="#74777F"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete={
                          isLogin ? "current-password" : "new-password"
                        }
                        selectionColor="#FFFFFF"
                        returnKeyType="go"
                        onSubmitEditing={handleSubmit}
                      />

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onPress={() => setShowPassword((value) => !value)}
                        hitSlop={8}
                        style={styles.visibilityButton}
                      >
                        <Text style={styles.visibilityText}>
                          {showPassword ? "Hide" : "Show"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {!!error && (
                    <Text style={styles.error} accessibilityLiveRegion="polite">
                      {error}
                    </Text>
                  )}

                  <Pressable
                    accessibilityRole="button"
                    onPress={handleSubmit}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      styles.submitButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.primaryText}>
                      {isLogin ? "Sign in" : "Create account"}
                    </Text>
                    <Text style={styles.primaryArrow}>↗</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => changeScreen("choice")}
                    style={styles.backButton}
                  >
                    <Text style={styles.backText}>← Back</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090B",
  },
  foreground: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 72,
    paddingBottom: 40,
  },
  panel: {
    width: "100%",
    maxWidth: 420,
  },
  intro: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  badgeText: {
    color: "#E0E0E3",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 51,
    fontWeight: "700",
    letterSpacing: -2,
  },
  subtitle: {
    color: "#B8B8BE",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 290,
  },
  card: {
    backgroundColor: "rgba(22,24,29,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 28,
    padding: 22,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.4,
    marginBottom: 7,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  primaryText: {
    color: "#111216",
    fontSize: 15,
    fontWeight: "700",
  },
  primaryArrow: {
    color: "#111216",
    fontSize: 24,
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  caption: {
    color: "#91939B",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  form: {
    gap: 18,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    padding: 4,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
  },
  activeTab: {
    backgroundColor: "#363941",
  },
  tabText: {
    color: "#92959F",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  field: {
    gap: 9,
  },
  label: {
    color: "#D9DADE",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  inputWrapper: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.035)",
    paddingLeft: 15,
    paddingRight: 12,
  },
  inputFocused: {
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  fieldIcon: {
    color: "#A4A7B0",
    fontSize: 18,
    width: 27,
    textAlign: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 54,
    paddingVertical: 0,
    color: "#FFFFFF",
    fontSize: 14,
  },
  visibilityButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 4,
  },
  visibilityText: {
    color: "#CACCD3",
    fontSize: 11,
    fontWeight: "600",
  },
  error: {
    color: "#FFADAD",
    fontSize: 12,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: 4,
  },
  backButton: {
    alignSelf: "center",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  backText: {
    color: "#ADB0BA",
    fontSize: 13,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
});
