import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type SplashProps = {
  onFinish?: () => void;
};

export function Splash({ onFinish }: SplashProps) {
  const [wordWidth, setWordWidth] = useState(0);

  const reveal = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Parent дахин render хийхэд анимаци дахин эхлэхгүй.
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (wordWidth === 0) return;

    reveal.setValue(0);
    logoOpacity.setValue(0);
    screenOpacity.setValue(1);

    const animation = Animated.sequence([
      Animated.delay(250),

      // Эхлээд F үсэг тодорно.
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.delay(180),

      // oodie нь F-ийн араас гарна.
      Animated.timing(reveal, {
        toValue: 1,
        duration: 850,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.delay(550),

      // Login хуудас руу зөөлөн шилжинэ.
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        finishRef.current?.();
      }
    });

    return () => animation.stop();
  }, [wordWidth, reveal, logoOpacity, screenOpacity]);

  return (
    <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
      {/* Үсгийн бодит өргөнийг хэмжинэ. */}
      <Text
        pointerEvents="none"
        accessible={false}
        style={[styles.letter, styles.measure]}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (width > 0) setWordWidth(width);
        }}
      >
        oodie
      </Text>

      <Animated.View
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [
              {
                // Эхэнд F голд, төгсгөлд Foodie голд байна.
                translateX: reveal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [wordWidth / 2, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.letter}>F</Text>

        <View style={[styles.mask, { width: wordWidth }]}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.letter,
              {
                width: wordWidth,
                transform: [
                  {
                    translateX: reveal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-wordWidth, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            oodie
          </Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#24262F",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  letter: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 42,
    fontWeight: "700",
    letterSpacing: 1,
    includeFontPadding: false,
  },
  mask: {
    height: 42,
    overflow: "hidden",
  },
  measure: {
    position: "absolute",
    opacity: 0,
  },
});
