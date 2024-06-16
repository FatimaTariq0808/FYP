import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Spacer from "../Components/Spacer";
import BackButton from "../Components/BackButton";

var { width } = Dimensions.get("window");

const WorkerOptions = () => {
  const navigation = useNavigation();
  const menuOptions = [
    {
      id: 1,
      title: "Contractor",
      color: "#c2eed0",
      image: require("../../assets/C.png"),
    },
    {
      id: 2,
      title: "Architect",
      color: "#c2eed0",
      image: require("../../assets/arch.png"),
    },
    {
      id: 3,
      title: "Interior Designer",
      color: "#c2eed0",
      image: require("../../assets/Interi.png"),
    },
    {
      id: 4,
      title: "BlackSmith",
      color: "#c2eed0",
      image: require("../../assets/blacksmith.png"),
    },
    {
      id: 5,
      title: "Electrician",
      color: "#c2eed0",
      image: require("../../assets/elec.png"),
    },
    {
      id: 6,
      title: "Plumber",
      color: "#c2eed0",
      image: require("../../assets/plumber.png"),
    },
  ];

  const [options, setOptions] = useState(menuOptions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const clickEventListener = (item) => {
    navigation.navigate("SignUp", { data: item.title });
  };

  const activityIndicatorColor = "#00716F";

  return (
    <View style={styles.container}>
      <Spacer />
      <BackButton />
      <Spacer />

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={options}
        horizontal={false}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => {
                clickEventListener(item);
              }}
            >
              <Image style={styles.cardImage} source={item.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: "#004d40",
    backgroundColor: "#f0f8ff",
  },
  list: {
    // backgroundColor: "#E6E6E6",
  },
  card: {
    marginTop: 20,
    width: width - 40,
    height: 150,
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    marginLeft: 20,
    color: "#00716F",
    fontWeight: "bold",
  },
});

export default WorkerOptions;
