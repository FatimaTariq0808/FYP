import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../context/authContext";
import { navigate } from "../navigationRef";

const SignInScreen = () => {
  const navigation = useNavigation();
  const { state, signIn, clearErrorMessage } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (state.errorMessage) {
      setEmail("");
      setPassword("");
      emailInputRef.current.focus();
    }
  }, [state.errorMessage]);

  // useEffect to clear input fields when the component is focused
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      clearErrorMessage(); // Clear error message on focus
      setEmail(""); // Clear email input
      setPassword(""); // Clear password input
    });

    return unsubscribeFocus;
  }, [navigation, clearErrorMessage]);

  return (
    <ImageBackground
      source={require("../../assets/wall1.jpg")}
      style={styles.backgroundImage}
      onLoad={() => setImageLoaded(true)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {!imageLoaded ? (
            // Show loading indicator or any content while the image is loading
            <ActivityIndicator size="large" color="#00716F" />
          ) : (
            <>
              <Text style={styles.header}>Hey There!</Text>
              <View style={styles.inputContainer}>
                <Icon name="user" size={24} color="#777" />
                <TextInput
                  ref={emailInputRef}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#FFF"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={24} color="#777" />
                <TextInput
                  // label="Password"
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#FFF"
                />
              </View>
              {state.errorMessage ? (
                <Text style={styles.errorMessage}> {state.errorMessage}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => {
                  // navigation.navigate("WorkerHomeScreen");
                  signIn({
                    email,
                    password,
                    setEmail,
                    setPassword,
                    emailInputRef,
                  });
                }}
              >
                <Text style={styles.signInButtonText}>Log In</Text>
              </TouchableOpacity>
              <View style={styles.signInContainer}>
                <View style={styles.signUpBox}>
                  <Text style={styles.signInText}>
                    Don't have an account?{" "}
                    <Text
                      style={{
                        color: "#FFF",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                      onPress={() => navigate("SignUpOptions")}
                    >
                      Sign Up instead
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginLeft: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 45,
    fontStyle: "italic",
    marginBottom: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginLeft: 8,
    paddingLeft: 16,
    borderRadius: 8,
    fontSize: 18,
    color: "#fff",
  },
  signInButton: {
    backgroundColor: "rgba(169, 169, 169, 0.3)",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderColor: "#FFF",
    borderWidth: 2,
    borderStyle: "solid",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 3,
    width: 310,
    height: 50,
    marginLeft: 25,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  signInContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signInText: {
    color: "#FFF",
    fontSize: 13,
  },
  signUpBox: {
    backgroundColor: "transparent", // Lighter tone of white with 0.8 transparency
    padding: 5, // Decreased padding
    borderRadius: 8,
    width: 270, // Decreased width
    marginLeft: 25,
  },
});

export default SignInScreen;
