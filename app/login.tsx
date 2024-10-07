import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSession } from "./ctx";
import { config } from "@/config";
import axios from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { signIn, session } = useSession();
  const [logoFadeAnim] = useState(new Animated.Value(0));
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // if (!session) {
    //   router.push("/onboard/bio");
    // }
    Animated.timing(logoFadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [logoFadeAnim, session]);

  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.post(
        `${config.api}/${config.api_v}/auth/login`,
        {
          email,
        },
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent to your email",
          text2: "Please check your email for the OTP code",
        });
        setIsOtpSent(true);
      } else {
        setErrorMessage("Invalid credentials");
        Toast.show({
          type: "error",
          text1: "Invalid credentials",
          text2: "Please try again",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
        Toast.show({
          type: "error",
          text1: "Invalid credentials",
          text2: "Please try again",
        });
      } else {
        setErrorMessage("Invalid credentials. Please try again later");
        Toast.show({
          type: "error",
          text1: "Invalid credentials",
          text2: "Please try again",
        });
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleOTP = async () => {
    setIsLoading(true); // Start loading
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.post(
        `${config.api}/${config.api_v}/auth/verify_otp`,
        {
          email,
          otp,
        },
      );

      if (response.data.success) {
        signIn(`${response.data.token}`);
        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: "Welcome to Karmatch",
        });

        setTimeout(() => {
          if (response.data.account_exists) {
            router.replace("/(tabs)");
          } else {
            router.replace("/onboard/age");
          }
        }, 1000);
      } else {
        setErrorMessage("Invalid OTP");
        Toast.show({
          type: "error",
          text1: "Invalid OTP",
          text2: "Please try again",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
        Toast.show({
          type: "error",
          text1: "Invalid OTP",
          text2: "Please try again",
        });
      } else {
        setErrorMessage("Invalid OTP. Please try again later");
        Toast.show({
          type: "error",
          text1: "Invalid OTP",
          text2: "Please try again",
        });
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View style={{ ...styles.logoContainer, opacity: logoFadeAnim }}>
        <Image
          source={{
            uri: "https://cdn.global.noobsverse.com/karmatch_cropped.png",
          }}
          style={styles.logo}
        />
      </Animated.View>
      <View style={styles.inputContainer}>
        {isOtpSent ? (
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor="#666666"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={() => (isOtpSent ? handleOTP() : handleLogin())}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isOtpSent ? "Continue" : "Send OTP"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark mode background
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 50,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 26,
  },
  button: {
    backgroundColor: "#c92a5f", // Primary orange color
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 6, // For subtle shadow on Android
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#FF5252",
    marginBottom: 10,
    textAlign: "center",
  },
});
