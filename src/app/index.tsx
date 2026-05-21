import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to DropRoom",
    description:
      "The fastest way to connect. No saving, no history, just real-time chat.",
    animation: require("../../assets/animations/welcome.json"),
  },
  {
    id: "2",
    title: "Lightning Fast",
    description:
      "Powered by a custom Go WebSocket engine. Messages arrive instantly.",
    animation: require("../../assets/animations/rocket.json"),
  },
  {
    id: "3",
    title: "Drop In. Chat. Drop Out.",
    description: "Join anonymously or with your Google account. Ready?",
    animation: require("../../assets/animations/stealth.json"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        scrollEventThrottle={16}
      >
        {slides.map((item) => (
          <View key={item.id} style={styles.slide}>
            <View style={styles.animationContainer}>
              <LottieView
                source={item.animation}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {currentIndex === slides.length - 1 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <AntDesign
              name="google"
              size={28}
              color="#DB4437"
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    width,
    alignItems: "center",
    // Pushed up from 0.15 to 0.10 to clear the dots
    paddingTop: height * 0.1,
  },
  animationContainer: {
    marginTop: 90,
    width: width * 0.75,
    height: width * 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.2, // Lifted slightly
    width: "100%",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#008080", // Teal
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#D1D5DB",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    paddingHorizontal: 30,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "600",
  },
});
