import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const PulseBubble = ({ delay = 0, align = "left" }) => {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={[
        styles.row,
        align === "right" ? styles.right : styles.left,
      ]}
    >
      <Animated.View style={[styles.bubble, style]} />
    </View>
  );
};

export default function ChatPulseShimmer() {
  return (
    <View style={styles.container}>
      <PulseBubble align="left" />
      <PulseBubble align="left" />
      <PulseBubble align="right" />
      <PulseBubble align="right" />
      <PulseBubble align="right" />
      <PulseBubble align="left" />
      <PulseBubble align="left" />
      <PulseBubble align="right" />
      <PulseBubble align="left" />
      <PulseBubble align="right" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    marginVertical: 8,
    width: "100%",
  },
  left: {
    alignItems: "flex-start",
  },
  right: {
    alignItems: "flex-end",
  },
  bubble: {
    width: 180,
    height: 42,
    borderRadius: 18,
    backgroundColor: "#D1D5DB",
  },
});