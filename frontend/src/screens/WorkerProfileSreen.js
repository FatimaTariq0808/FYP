import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Context as AuthContext } from "../context/authContext";
import BackButton from "../Components/BackButton";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const WorkerProfileScreen = () => {
  const navigation = useNavigation();
  const { state, userProfile } = useContext(AuthContext);
  // console.log(state);
  const workerProjects = [
    // Define workerProjects array as per your requirements
  ];

  const workerInfo = {
    avatarUri: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
    name: state.username, // Use real name from AuthContext state
    email: state.email, // Use real email from AuthContext state
    location: state.address,

    bio: "I am passionate about turning your construction dreams into reality. Whether you're envisioning a new home, a commercial space, or a transformative renovation, I have the expertise and dedication to make it happen. Let's collaborate to build something extraordinary.",
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
      <ScrollView>
        <TouchableOpacity onPress={handlePress} style={styles.navbar}>
          <AntDesign name="arrowleft" size={24} color="#004d40" />
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            {/* <Image source={{ uri: workerInfo.avatarUri }} style={styles.avatar} /> */}
            <Image
              source={require("../../assets/user.png")}
              style={styles.avatar}
            />
            <Text style={styles.name}>{workerInfo.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{workerInfo.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{workerInfo.location}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoValue}>{workerInfo.bio}</Text>
          </View>

          {/* <View style={styles.projectsContainer}>
          <Text style={styles.projectsHeading}>Projects</Text>
          <FlatList
            data={workerProjects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProjectItem}
          />
        </View> */}
        </View>

        <TouchableOpacity onPress={handleLogOut} style={styles.navbarLogOut}>
          <AntDesign name="logout" size={24} color="black" />
          <Text style={styles.barText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Green texture background color
    // alignContent: "center",
    justifyContent: "center",
    paddingTop: 35,
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
    height: CARD_WIDTH + 250,
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
    // alignItems: "center",
    paddingRight: 10,
    marginTop: 20,
    paddingBottom: 20, // Add paddingBottom to create space for the logout button
  },
  barContainerLogOut: {
    flexDirection: "row",
    alignItems: "center",
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

export default WorkerProfileScreen;
