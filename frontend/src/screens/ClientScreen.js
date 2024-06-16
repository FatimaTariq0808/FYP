import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { Context } from "../context/authContext";

const ClientScreen = () => {
  const navigation = useNavigation();
  const { state, signUp, clearErrorMessage } = useContext(Context);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [requiredFieldError, setRequiredFieldError] = useState("");

  const validateRequiredFields = () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      setRequiredFieldError("All fields are required");
      setTimeout(() => setRequiredFieldError(""), 5000);
      return false;
    } else {
      setRequiredFieldError("");
      return true;
    }
  };

  const validateEmail = (text) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(text) || !text.endsWith("@gmail.com")) {
      setEmailError("Must have a valid Gmail address (@gmail.com)");
      setTimeout(() => setEmailError(""), 3000);
    } else {
      setEmailError("");
    }

    setEmail(text);
  };

  const validatePassword = (text) => {
    if (text.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setTimeout(() => setPasswordError(""), 3000);
    } else {
      setPasswordError("");
    }

    setPassword(text);
  };

  const validateConfirmPassword = (text) => {
    if (text !== password) {
      setConfirmPasswordError("Passwords do not match");
      setTimeout(() => setConfirmPasswordError(""), 3000);
    } else {
      setConfirmPasswordError("");
    }

    setConfirmPassword(text);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clearErrorMessage();
    }, 5000);
    return () => clearTimeout(timer);
  }, [state.errorMessage]);
  const handleSignUp = () => {
    const areRequiredFieldsValid = validateRequiredFields();

    // navigation.navigate("SignIn");
  };

  return (
    <View>
      <BackButton />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/client_house.jpg")}
            style={styles.image}
          />
          <Text style={styles.title}>Welcome Client!</Text>

          <Text style={styles.subtitle}>
            Building a house has never been easier! We hope you get your dream
            home.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor="#00716F"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#00716F"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          {emailError ? (
            <Text style={styles.errorMessage}>{emailError}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <TextInput
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#00716F"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorMessage}>{passwordError}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <TextInput
              secureTextEntry
              placeholder="Confirm Password"
              placeholderTextColor="#00716F"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          {confirmPasswordError ? (
            <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#00716F"
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          {requiredFieldError ? (
            <Text style={styles.errorMessage}>{requiredFieldError}</Text>
          ) : null}
          {state.errorMessage ? (
            <Text style={styles.errorMessage}> {state.errorMessage}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              signUp(
                {
                  username,
                  email,
                  password,
                  confirmPassword,
                  address,
                },
                validateRequiredFields()
              );
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: "33%",
    aspectRatio: 3 / 2,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
  },
  subtitle: {
    marginHorizontal: 55,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 55,
    borderWidth: 2,
    marginTop: 15,
    paddingHorizontal: 10,
    borderColor: "#00716F",
    borderRadius: 30,
    paddingVertical: 15,
    position: "relative",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    marginHorizontal: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#00716F",
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 70,
  },
});

export default ClientScreen;
