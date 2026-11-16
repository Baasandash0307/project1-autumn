import { useAuth } from "@/context/auth";
import { Redirect, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return <Redirect href="/login?next=profile" />;
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Хувийн мэдээлэл</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.body}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Нэр</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Имэйл</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            logout();
            router.replace("/");
          }}
          style={({ pressed }) => [
            styles.logout,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.logoutText}>Гарах</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#24262F",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#FF7668",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  avatarText: {
    color: "#24262F",
    fontSize: 36,
    fontWeight: "800",
  },
  card: {
    width: "100%",
    backgroundColor: "#32353F",
    borderRadius: 22,
    paddingHorizontal: 18,
  },
  row: {
    paddingVertical: 16,
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  label: {
    color: "#9094A3",
    fontSize: 12,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logout: {
    width: "100%",
    minHeight: 56,
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: "#FF7668",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#24262F",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
});
