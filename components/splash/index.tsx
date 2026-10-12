import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const WORD_WIDTH = 140;

type SplashProps = {
  onFinish?: () => void;
};

export function Splash({ onFinish }: SplashProps) {
  const reveal = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(400),
      Animated.timing(reveal, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(500),
      Animated.timing(fade, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onFinish?.();
      }
    });

    return () => animation.stop();
  }, [reveal, fade, onFinish]);

  return (
    <Animated.View style={[styles.screen, { opacity: fade }]}>
      <View style={styles.logo}>
        <Text style={styles.letter}>F</Text>

        <Animated.View
          style={[
            styles.mask,
            {
              width: reveal.interpolate({
                inputRange: [0, 1],
                outputRange: [0, WORD_WIDTH],
              }),
            },
          ]}
        >
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.letter,
              styles.rest,
              {
                transform: [
                  {
                    translateX: reveal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-WORD_WIDTH, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            oodie
          </Animated.Text>
        </Animated.View>
      </View>
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
    backgroundColor: "#EF2A39",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  letter: {
    color: "#fff",
    fontSize: 48,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: 1,
  },
  mask: {
    height: 64,
    overflow: "hidden",
  },
  rest: {
    width: WORD_WIDTH,
  },
});
