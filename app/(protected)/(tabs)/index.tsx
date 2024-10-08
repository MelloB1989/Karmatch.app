import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Image,
  Animated,
  Platform,
} from "react-native";
import axios from "axios";
import { config } from "@/config";
import { useSession } from "@/app/ctx";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Message type definition
interface Message {
  text: string;
  isUser: boolean; // Determines if the message is from the user or AI
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false); // State for typing indicator
  const animation = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Message>>(null); // Create a ref for the FlatList

  const { session } = useSession();

  useEffect(() => {
    AsyncStorage.getItem("messages").then((messages) => {
      if (messages || messages === "[]") {
        setMessages(JSON.parse(messages));
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim().length > 0) {
      // Add user message
      const userMessage = { text: inputText, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText("");

      // Auto-scroll to the bottom after sending the message
      flatListRef.current?.scrollToEnd({ animated: true });

      // Show typing indicator
      setIsTyping(true);

      try {
        const r = await axios.post(
          `${config.api}/${config.api_v}/ai/conversation`,
          {
            message: inputText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
          },
        );
        if (r.data.success) {
          const aiResponse = { text: r.data.ai_message, isUser: false };
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: r.data.message,
          });
        }
        setIsTyping(false);
      } catch (e) {
        console.log(e);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send message",
        });
        setIsTyping(false);
      }

      // // Simulate AI response after a delay
      // setTimeout(() => {
      //   const aiResponse = { text: "This is an AI response", isUser: false };
      //   setMessages((prevMessages) => [...prevMessages, aiResponse]);

      //   // Hide typing indicator
      //   setIsTyping(false);

      //   // Auto-scroll to the bottom after adding AI response
      //   flatListRef.current?.scrollToEnd({ animated: true });
      //   animateBubble(); // Animate the bubble after adding the message
      // }, 1000);

      // Reset animation for new message
      animateBubble();
    }
  };

  const animateBubble = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Animated.View
      style={[
        styles.chatBubble,
        {
          alignSelf: item.isUser ? "flex-end" : "flex-start", // Right for user, left for AI
          backgroundColor: item.isUser ? "#FF1493" : "#333", // Dark pink for user, gray for AI
          transform: [{ translateY: animation }],
        },
      ]}
    >
      <Text style={styles.chatText}>{item.text}</Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust this value as needed
    >
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../assets/images/Lisa.jpg")}
          style={styles.avatar}
        />
      </View>

      <FlatList
        ref={flatListRef} // Set the ref here
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={styles.chatContainer}
        contentContainerStyle={styles.flatListContentContainer}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF1493",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flatListContentContainer: {
    paddingBottom: 80, // Increase bottom padding
    paddingTop: 10, // Add top padding if needed
  },
  chatBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "75%",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    backgroundColor: "#121212", // Match background color
  },
  textInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#FF1493",
    padding: 12,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  typingIndicator: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#444",
    borderRadius: 20,
    marginVertical: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
    opacity: 0.8,
  },
  typingText: {
    color: "#fff",
    fontSize: 14,
  },
});
