import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuthStore } from "../../../store/useAuthStore";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: string;
  username?: string;
}

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user, token } = useAuthStore();

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    const wsUrl = `ws://3.110.85.35:7777/ws/room/${id}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("🟢 WEBSOCKET CONNECTED!");
      setMessages((prev) => [
        ...prev,
        {
          id: "sys-1",
          text: "Connected to server.",
          sender: "system",
          timestamp: "",
        },
      ]);
    };

    ws.current.onmessage = (event) => {
      console.log("🔵 Incoming Packet:", event.data);
      const incomingData = JSON.parse(event.data);

      const incomingMessage: Message = {
        id: incomingData.id || Date.now().toString(),
        text: incomingData.text,
        sender: incomingData.username === user?.username ? "me" : "other",
        username: incomingData.username,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, incomingMessage]);
    };

    ws.current.onerror = (error) => {
      console.error("🔴 WEBSOCKET ERROR:", error);
    };

    return () => {
      console.log("⚪ CLOSING WEBSOCKET");
      ws.current?.close();
    };
  }, [id, token]);

  const handleLeaveRoom = () => {
    router.back();
  };

  const handleSendMessage = () => {
    if (inputText.trim().length > 0 && ws.current) {
      const payload = {
        text: inputText.trim(),
        username: user?.username,
      };
      ws.current.send(JSON.stringify(payload));

      setInputText("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    const isSystem = item.sender === "system";

    if (isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
        ]}
      >
        {!isMe && <Text style={styles.senderName}>@{item.username}</Text>}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextOther,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Navigation Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLeaveRoom} style={styles.backButton}>
            <Feather name="chevron-left" size={28} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.roomTitle}>Room: {id}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Live</Text>
            </View>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chat Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color="#FFFFFF"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981", // Emerald green for connection status
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  headerSpacer: {
    width: 36, // Balances the back button for absolute centering
  },
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  systemMessageText: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    color: "#6B7280",
    overflow: "hidden",
  },
  messageWrapper: {
    marginVertical: 6,
    maxWidth: "80%",
  },
  messageWrapperMe: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageWrapperOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: "#008080", // Teal
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextMe: {
    color: "#FFFFFF",
  },
  messageTextOther: {
    color: "#1F2937",
  },
  timestamp: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: "#111827",
    maxHeight: 100, // Allows multiline to grow slightly then scroll
  },
  sendButton: {
    backgroundColor: "#008080",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    marginBottom: 2, // Aligns with the bottom of the input
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  sendIcon: {
    marginLeft: 2, // Minor visual adjustment to center the send arrow
  },
});
