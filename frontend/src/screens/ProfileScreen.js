import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Context as AuthContext } from "../context/authContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { state, signOut, userProfile } = useContext(AuthContext);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  const userProjects = [
    // Define userProjects array as per your requirements
  ];

  const userInfo = {
    avatarUri: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
    name: state.username,
    email: state.email,
    location: state.address,
    bio: "I am Client.",
  };

  const handlePress = () => {
    navigation.goBack();
  };

  const handleLogOut = () => {
    navigation.navigate("SignIn");
  };

  useEffect(() => {
    userProfile();
  }, []);

  const renderProjectItem = ({ item }) => {
    return (
      <View style={styles.projectCard}>
        <Text style={styles.projectName}>{item.projectName}</Text>
        {item.projectDetails.map((detail, index) => (
          <View key={index} style={styles.projectDetail}>
            <Text style={styles.detailHeading}>{detail.heading}:</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.navbar}>
        <AntDesign name="arrowleft" size={24} color="#004d40" />
      </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userInfo.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userInfo.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>{userInfo.location}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Bio:</Text>
          <Text style={styles.infoValue}>{userInfo.bio}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogOut} style={styles.navbarLogOut}>
        <AntDesign name="logout" size={24} color="black" />
        <Text style={styles.barText}>Log Out</Text>
      </TouchableOpacity>
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
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#00716F",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: CARD_WIDTH,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 50,
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: "center",
  },
  navbarLogOut: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    marginTop: 50,
    paddingBottom: 50,
  },
  barText: {
    marginLeft: 5,
  },
  navbar: {
    height: 50,
    top: 20,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  avatar: {
    marginTop: 25,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00716F",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#00716F",
    textDecorationLine: "underline",
  },
  infoValue: {
    marginTop: 5,
    color: "black",
  },
  projectsContainer: {
    marginTop: 20,
  },
  projectsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00716F",
    marginBottom: 10,
  },
  projectCard: {
    width: "100%",
    backgroundColor: "#d3f5e9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00716F",
    marginBottom: 8,
  },
  projectDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailHeading: {
    fontWeight: "bold",
    marginRight: 4,
    color: "#00716F",
  },
  detailValue: {
    flex: 1,
  },
});

export default ProfileScreen;
