import { Feather, FontAwesome5 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../../store/useAuthStore";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [isDevExpanded, setIsDevExpanded] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDevCard = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDevExpanded(!isDevExpanded);
  };

  const openPortfolio = () => Linking.openURL("https://www.vedx.dev");
  const openGithub = () => Linking.openURL("https://github.com/V3DxNT");

  return (
    <SafeAreaView
      style={styles.bottomSafeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={styles.headerTitle}>Account</Text>

        <View style={styles.content}>
          {user?.profilePic &&
          typeof user.profilePic === "string" &&
          user.profilePic.length > 5 ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Feather name="user" size={40} color="#9CA3AF" />
            </View>
          )}

          <Text style={styles.usernameText}>
            @{user?.username || "droproom_user"}
          </Text>
          <Text style={styles.emailText}>
            {user?.email || "No email attached"}
          </Text>

          <View style={styles.brandingSection}>
            <Text style={styles.sectionLabel}>App Architect</Text>

            <TouchableOpacity
              style={styles.devCard}
              onPress={toggleDevCard}
              activeOpacity={0.95}
            >
              {!isDevExpanded ? (
                <View style={styles.compactCardView}>
                  <View style={styles.pulseWrapper}>
                    <LottieView
                      source={require("../../../assets/animations/code-pulse.json")}
                      autoPlay
                      loop
                      style={styles.pulseAnimation}
                    />

                    <View style={styles.compactAvatarPlaceholder}>
                      <Image
                        source={require("../../../assets/images/VED.png")}
                        style={styles.customImageCompact}
                      />
                    </View>
                  </View>

                  <Text style={styles.compactName}>Vedant</Text>
                  <Text style={styles.compactTapText}>Tap</Text>
                </View>
              ) : (
                // --- EXPANDED STATE ---
                <View style={styles.expandedCardView}>
                  <View style={styles.expandedHeader}>
                    <Text style={styles.expandedName}>Vedant Asthana</Text>
                    <Text style={styles.expandedHandle}>• @V3DXNT •</Text>
                  </View>

                  <Text style={styles.bioText}>
                    Architecting scalable web infrastructure and real-time
                    systems. Specializing in Event-Driven architectures,
                    distributed Data Pipelines, and high-performance Backend
                    Infrastructure.
                  </Text>

                  <View style={styles.techStackContainer}>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>Java</Text>
                    </View>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>GoLang</Text>
                    </View>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>TypeScript</Text>
                    </View>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>Docker</Text>
                    </View>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>PostgreSQL</Text>
                    </View>
                    <View style={styles.techBadge}>
                      <Text style={styles.techText}>MongoDB</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.portfolioButton}
                      onPress={openPortfolio}
                      activeOpacity={0.8}
                    >
                      <Feather
                        name="globe"
                        size={16}
                        color="#FFFFFF"
                        style={styles.btnIcon}
                      />
                      <Text style={styles.portfolioButtonText}>vedx.dev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={openGithub}
                      activeOpacity={0.8}
                    >
                      <FontAwesome5 name="github" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Feather
            name="log-out"
            size={20}
            color="#4B5563"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 30,
  },
  content: { alignItems: "center", flex: 1 },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#008080",
  },
  placeholderAvatar: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E7EB",
  },
  usernameText: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  emailText: { fontSize: 15, color: "#6B7280", marginTop: 4, marginBottom: 40 },

  brandingSection: { width: "100%", marginTop: 10, marginBottom: 30 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  devCard: {
    backgroundColor: "#FAFAFA",
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // --- NEW COMPACT STYLES ---
  compactCardView: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseWrapper: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  pulseAnimation: { position: "absolute", width: 180, height: 180, zIndex: 0 },
  compactAvatarPlaceholder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#FCA5A5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactAvatarText: { color: "#DC2626", fontWeight: "bold", fontSize: 26 },
  customImageCompact: { width: "100%", height: "100%", borderRadius: 33 },
  compactName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  compactTapText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  expandedCardView: { padding: 24, alignItems: "center" },
  expandedHeader: { alignItems: "center", marginBottom: 16 },
  largeAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#DC2626",
  },
  largeAvatarText: { color: "#DC2626", fontWeight: "bold", fontSize: 32 },
  customImageLarge: { width: "100%", height: "100%", borderRadius: 40 },
  expandedName: { fontSize: 22, fontWeight: "800", color: "#1F2937" },
  expandedHandle: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: "600",
  },

  bioText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },

  techStackContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  techBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  techText: { fontSize: 12, color: "#DC2626", fontWeight: "700" },

  actionRow: { flexDirection: "row", width: "100%", gap: 12 },
  portfolioButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  portfolioButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  btnIcon: { marginRight: 8 },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
  },
  logoutIcon: { marginRight: 10 },
  logoutText: { color: "#4B5563", fontSize: 16, fontWeight: "bold" },
});
