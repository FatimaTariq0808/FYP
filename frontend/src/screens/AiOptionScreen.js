import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";

const AiOptionsScreen = () => {
  const navigation = useNavigation();

  const renderCard = (imageSource, title, navigateTo) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(navigateTo)}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.buttonImage} />
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Choose an Option</Text>
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          {renderCard(
            require("../../assets/predict.png"),
            "Predict Price",
            "PredictScreen"
          )}
        </View>
        <View style={styles.cardRow}>
          {renderCard(
            require("../../assets/recommend.png"),
            "Recommend Location",
            "RecommendScreen"
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 25,
    textTransform: "capitalize",
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00716F",
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#c2eed0",
    borderRadius: 12,
    overflow: "hidden",
    margin: 20,
    padding: 10,
    width: 200,
    height: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    borderBottomWidth: 2,
    borderColor: "#00716F",
    alignItems: "center",
  },
  buttonImage: {
    width: 90,
    height: 130,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#00716F",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AiOptionsScreen;
