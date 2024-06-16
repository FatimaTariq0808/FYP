import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";

const RecommendScreen = () => {
  const navigation = useNavigation();
  const [budget, setBudget] = useState("");
  const [baths, setBaths] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [city, setCity] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRecommend = async () => {
    const data = {
      budget: parseInt(budget),
      baths: parseInt(baths),
      bedrooms: parseInt(bedrooms),
      city,
      area_sqft: parseFloat(areaSqft),
    };

    try {
      const response = await fetch("http://192.168.8.106:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setRecommendations(result.recommended_locations);
      setErrorMessage("");
      setModalVisible(true);
    } catch (error) {
      console.error("Error making recommendation request:", error);
      setErrorMessage("An error occurred while fetching recommendations.");
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
        <Text style={styles.title}>Property Recommendations</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Budget"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          <TextInput
            style={styles.input}
            placeholder="Baths"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={baths}
            onChangeText={setBaths}
          />
          <TextInput
            style={styles.input}
            placeholder="Bedrooms"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={bedrooms}
            onChangeText={setBedrooms}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Area (sqft)"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={areaSqft}
            onChangeText={setAreaSqft}
          />
          <TouchableOpacity style={styles.button} onPress={handleRecommend}>
            <Text style={styles.buttonText}>Get Recommendations</Text>
          </TouchableOpacity>

          {errorMessage !== "" && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              navigation.navigate("HomeScreen");
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Recommended Locations</Text>
                {recommendations.map((location, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text>{location}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("HomeScreen");
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f0f8ff",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    opacity: 0.6,
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#00716F",
  },
  input: {
    height: 45,
    borderColor: "#00716F",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  tableRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#00716F",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
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
});

export default RecommendScreen;
