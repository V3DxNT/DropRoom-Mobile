import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../../store/useAuthStore";

import ChatShimmer from "../../../components/ChatShimmer";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: string;
  username?: string;
  profilePic?:string
}

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user, token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://3.110.85.35:7777/api/chat/history/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        const formattedMessages: Message[] = data
          .filter((msg: any) => msg.messageText?.trim())
          .map((msg: any, index: number) => ({
            id: `${msg.timestamp}-${index}`,
            text: msg.messageText,
            profilePic: msg.senderProfilePic,
            sender: msg.senderUsername === user?.username ? "me" : "other",
            username: msg.senderUsername || "Unknown",
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })).reverse();
        setMessages(formattedMessages);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };
    const initializeRoom = async () => {
      await fetchHistory();
      setLoading(false);

      const wsUrl = `ws://3.110.85.35:7777/api/ws/${id}?token=${token}`;
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

        const msgText =
          incomingData.messageText ||
          incomingData.text ||
          incomingData.Text ||
          "";
        const msgUsername =
          incomingData.senderUsername ||
          incomingData.username ||
          incomingData.Username ||
          "Unknown";

        const msgId =
          incomingData.id ||
          incomingData.Id ||
          incomingData._id ||
          `${Date.now()}-${Math.random()}`;

          const msgProfilePic = incomingData.senderProfilePic || incomingData.SenderProfilePic || "";

        const incomingMessage: Message = {
          id: msgId,
          text: msgText,
          sender: msgUsername === user?.username ? "me" : "other",
          username: msgUsername,
          profilePic: msgProfilePic,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        if (msgText.trim()) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === incomingMessage.id);
            if (exists) return prev;
            return [...prev, incomingMessage];
          });
        }
      };

      ws.current.onerror = (error) => {
        console.error("🔴 WEBSOCKET ERROR:", error);
      };
    };
    initializeRoom();

    return () => {
      console.log("⚪ CLOSING WEBSOCKET");
      ws.current?.close();
    };
  }, [id, token]);

  const handleLeaveRoom = () => {
    router.back();
  };

  const handleSendMessage = () => {
    if (
      inputText.trim().length > 0 &&
      ws.current?.readyState === WebSocket.OPEN
    ) {
      const payload = {
        text: inputText.trim(),
        messageText: inputText.trim(),
        MessageText: inputText.trim(),
        username: user?.username,
        senderUsername: user?.username,
        SenderUsername: user?.username,
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
        
        {/* 👇 WRAP BUBBLE AND AVATAR IN A ROW */}
        <View style={isMe ? styles.messageRowMe : styles.messageRowOther}>
          
          {!isMe && item.profilePic ? (
            <Image source={{ uri: item.profilePic }} style={styles.avatar} />
          ) : null}

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

        </View>

        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView
        style={styles.bottomSafeArea}
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
        >
          {/* Top Navigation Bar */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleLeaveRoom}
              style={styles.backButton}
            >
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

          <View style={styles.chatAreaContainer}>
            {loading ? (
              <ChatShimmer />
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: false })
                }
              />
            )}
          </View>

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
    </>
  );
}


const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: "#000000", // Makes the notch/notification area black
  },
  bottomSafeArea: {
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    elevation: 2, // Slight shadow for separation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  headerSpacer: {
    width: 36,
  },
  chatAreaContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Slight off-white to make the bubbles pop
  },
  chatList: {
    padding: 16,
    paddingBottom: 10,
    flexGrow: 1,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  systemMessageText: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    color: "#4B5563",
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
    fontWeight: "500",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  messageBubbleMe: {
    backgroundColor: "#008080", // Teal primary
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: "#FFFFFF", // Crisp white for contrast
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingBottom: Platform.OS === "ios" ? 14 : 10,
    elevation: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: "#111827",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#008080",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  sendIcon: {
    marginLeft: 2,
  },
  messageRowMe: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  messageRowOther: {
    flexDirection: "row",
    alignItems: "flex-end", 
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: "#E5E7EB",
  },
});
