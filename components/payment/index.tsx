import { useCheckout } from "@/context/checkout";
import { notify } from "@/lib/notifications";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const methods = [
  { id: "qpay", title: "QPay", detail: "Банкны аппаар төлөх" },
  { id: "socialpay", title: "SocialPay", detail: "Голомт банк" },
  { id: "card", title: "Банкны карт", detail: "Visa, Mastercard" },
  { id: "cash", title: "Бэлнээр", detail: "Хүргэлт дээр төлнө" },
] as const;

type MethodId = (typeof methods)[number]["id"];

const money = (value: number) => `${value.toLocaleString()}₮`;

function PaymentSuccess({
  onConfirmed,
  onFinish,
}: {
  onConfirmed: () => void;
  onFinish: () => void;
}) {
  const spin = useRef(new Animated.Value(0)).current;
  const flip = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  const [showCheck, setShowCheck] = useState(false);
  const confirmed = useRef(onConfirmed);

  useEffect(() => {
    confirmed.current = onConfirmed;
  }, [onConfirmed]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 650,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    const timeout = setTimeout(() => {
      loop.stop();

      Animated.timing(flip, {
        toValue: 1,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;

        setShowCheck(true);
        flip.setValue(-1);
        confirmed.current();
        void notify("Захиалга амжилттай", "Таны захиалгыг хүлээж авлаа.");

        Animated.parallel([
          Animated.spring(flip, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(reveal, {
            toValue: 1,
            duration: 380,
            delay: 90,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 1100);

    return () => {
      clearTimeout(timeout);
      loop.stop();
    };
  }, [spin, flip, reveal]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateY = flip.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-90deg", "0deg", "90deg"],
  });

  return (
    <View style={styles.success}>
      <View style={styles.flipStage}>
        <Animated.View
          style={[
            styles.badge,
            showCheck && styles.badgeDone,
            { transform: [{ rotateY }] },
          ]}
        >
          {showCheck ? (
            <Text style={styles.successMark}>✓</Text>
          ) : (
            <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
          )}
        </Animated.View>
      </View>

      {showCheck ? (
        <Animated.View
          style={[
            styles.successCopy,
            {
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.successTitle}>Төлбөр амжилттай</Text>
          <Text style={styles.successText}>
            Таны захиалгыг хүлээж авлаа. Баярлалаа.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onFinish}
            style={({ pressed }) => [
              styles.payButton,
              styles.successButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.payText}>Нүүр хуудас</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Text style={styles.successText}>Төлбөр шалгаж байна...</Text>
      )}
    </View>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const { lines, total, completeCheckout } = useCheckout();
  const [method, setMethod] = useState<MethodId | null>(null);
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (lines.length === 0 && !paid) {
    return <Redirect href="/" />;
  }

  const finish = () => {
    completeCheckout();

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            if (paid && !confirmed) return;

            if (paid) {
              finish();
              return;
            }

            router.back();
          }}
          style={styles.backButton}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Төлбөр төлөх</Text>
        <View style={styles.backButton} />
      </View>

      {paid ? (
        <PaymentSuccess
          onConfirmed={() => setConfirmed(true)}
          onFinish={finish}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {lines.map((line) => (
              <View key={line.name} style={styles.line}>
                <Text style={styles.lineName}>
                  {line.name} × {line.quantity}
                </Text>
                <Text style={styles.linePrice}>
                  {money(line.price * line.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.line}>
              <Text style={styles.totalLabel}>Нийт</Text>
              <Text style={styles.totalValue}>{money(total)}</Text>
            </View>
          </View>

          <Text style={styles.section}>Төлбөрийн хэлбэр</Text>

          <View style={styles.methods}>
            {methods.map((item) => {
              const selected = method === item.id;

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setMethod(item.id)}
                  style={[styles.method, selected && styles.methodSelected]}
                >
                  <View
                    style={[styles.radio, selected && styles.radioSelected]}
                  >
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.methodText}>
                    <Text style={styles.methodTitle}>{item.title}</Text>
                    <Text style={styles.methodDetail}>{item.detail}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={method === null}
            onPress={() => setPaid(true)}
            style={({ pressed }) => [
              styles.payButton,
              method === null && styles.payDisabled,
              pressed && method !== null && styles.pressed,
            ]}
          >
            <Text style={styles.payText}>Төлөх · {money(total)}</Text>
          </Pressable>
        </ScrollView>
      )}
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#32353F",
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  lineName: {
    flex: 1,
    color: "#E3E4EB",
    fontSize: 14,
  },
  linePrice: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  totalLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    color: "#FF7668",
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 28,
    marginBottom: 14,
  },
  methods: {
    gap: 10,
  },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#32353F",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  methodSelected: {
    borderColor: "#FF7668",
    backgroundColor: "#443333",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9094A3",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#FF7668",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF7668",
  },
  methodText: {
    flex: 1,
    gap: 3,
  },
  methodTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  methodDetail: {
    color: "#9094A3",
    fontSize: 12,
  },
  payButton: {
    marginTop: 28,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#FF7668",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  payDisabled: {
    opacity: 0.45,
  },
  payText: {
    color: "#24262F",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
  success: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  flipStage: {
    width: 72,
    height: 72,
    marginBottom: 20,
    transform: [{ perspective: 800 }],
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDone: {
    backgroundColor: "#FF7668",
  },
  spinner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "rgba(255,118,104,0.22)",
    borderTopColor: "#FF7668",
  },
  successMark: {
    color: "#24262F",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40,
  },
  successCopy: {
    width: "100%",
    alignItems: "center",
  },
  successButton: {
    alignSelf: "stretch",
  },
  successTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  successText: {
    color: "#9094A3",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
  },
});
