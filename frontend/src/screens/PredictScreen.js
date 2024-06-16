import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";

const PredictScreen = () => {
  const navigation = useNavigation();
  const [baths, setBaths] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handlePredict = async () => {
    const data = {
      baths: parseInt(baths),
      bedrooms: parseInt(bedrooms),
      area_sqft: parseFloat(areaSqft),
      city,
      location,
    };

    try {
      const response = await fetch("http://192.168.8.106:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const roundedPrice = Math.round(result.predicted_price * 100) / 100;

      //   alert(`Predicted Price: ${result.predicted_price}`);
      Alert.alert(
        "Predicted Price",
        `The predicted price is Rs.${roundedPrice}`,
        [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate("HomeScreen");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error making prediction request:", error);
      setErrorMessage("An error occurred while predicting the price.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/ai1.jpg")}
      style={styles.backgroundImage}
      onLoad={() => setImageLoaded(true)}
    >
      <View style={styles.container}>
        <BackButton />
        <Text style={styles.heading}>Predict Price</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Baths:</Text>
          <TextInput
            style={styles.input}
            value={baths}
            onChangeText={setBaths}
            keyboardType="numeric"
          />

          <Text style={styles.title}>Bedrooms:</Text>
          <TextInput
            style={styles.input}
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
          />

          <Text style={styles.title}>Area (sqft):</Text>
          <TextInput
            style={styles.input}
            value={areaSqft}
            onChangeText={setAreaSqft}
            keyboardType="numeric"
          />

          <Text style={styles.title}>City:</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          <Text style={styles.title}>Location:</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity style={styles.button} onPress={handlePredict}>
            <Text style={styles.buttonText}>Predict Price</Text>
          </TouchableOpacity>
        </View>

        {predictedPrice !== null && (
          <Text style={styles.resultText}>
            Predicted Price: ${predictedPrice}
          </Text>
        )}

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    opacity: 0.7,
    zIndex: 0.2,
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  title: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    height: 40,
    borderColor: "#00716F",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: "#00716F",
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});

export default PredictScreen;
