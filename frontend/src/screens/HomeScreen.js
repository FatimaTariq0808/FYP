import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../Components/BackButton";
import { AntDesign } from "@expo/vector-icons";
import { Context as AuthContext } from "../context/authContext";
import StarRating from "../Components/StarRating";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Context as ProposalContext } from "../context/proposalContext";

const HomeScreen = () => {
  // Dummy data for worker recommendations

  const navigation = useNavigation();
  // const { state } = useContext(ProposalContext);
  const { state, fetchWorkers, getReviews } = useContext(AuthContext);
  const [id, setId] = useState(false);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        const i = await fetchWorkers();
        // console.log(state.worker);
      }
    };

    fetchData();
  }, [isFocused, fetchWorkers]);
  // console.log(state);

  // console.log(workerState);

  // console.log(state.proposal);

  const workerRecommendations = [
    {
      id: 1,
      title: "Experienced Contractor",
      description: " Home renovations",
      image: require("../../assets/C.png"),
    },
    {
      id: 2,
      title: "Creative Architect",
      description: "Innovative Designs",
      image: require("../../assets/C.png"),
    },
    {
      id: 3,
      title: "Skilled Interior Designer",
      description: "Transforms Spaces ",
      image: require("../../assets/C.png"),
    },
    {
      id: 4,
      title: "Expert Electrician",
      description: " Electrical Solutions",
      image: require("../../assets/C.png"),
    },
    {
      id: 5,
      title: "Professional Contractor",
      description: "Expert in construction projects",
      image: require("../../assets/C.png"),
    },
    {
      id: 6,
      title: "Innovative Architect",
      description: "Modern Concepts to life",
      image: require("../../assets/C.png"),
    },
    // Add more worker recommendations as needed
  ];

  const tipsoftheWeek = [
    {
      id: 1,
      title: "Energy Saving Tips",
      description:
        "Switch to LED bulbs to save energy and reduce electricity costs.",
    },
    {
      id: 2,
      title: "Design Idea",
      description:
        "Try adding accent walls with bold colors to enhance the visual appeal of your rooms.",
    },
  ];

  const [recommendations, setRecommeßndations] = useState(
    workerRecommendations
  );
  const [currentTip, setCurrentTip] = useState(tipsoftheWeek[0]);
  // console.log(recommendations, currentTip);
  // const [recommendations, setRecommeßndations] = useState([]);
  // const [currentTip, setCurrentTip] = useState(tipsoftheWeek[0]);
  // useEffect(() => {
  //   setRecommeßndations(workerRecommendations);
  // }, []);

  // console.log(workerState);
  // const memoizedFetchWorkers = useCallback(() => {
  //   fetchWorkers();
  //   setWorkersFetched(true);
  // }, [fetchWorkers]);

  // useEffect(() => {
  //   if (!workersFetched) {
  //     memoizedFetchWorkers();
  //   }
  // }, [workersFetched, memoizedFetchWorkers]);

  // fetchWorkers();

  // fetchWorkers();
  // console.log(state.worker);

  useEffect(() => {
    if (state.worker !== undefined) {
      const roles = Object.keys(state.worker);
      roles.forEach((role) => {
        if (
          state.worker[role] &&
          Array.isArray(state.worker[role]) &&
          state.worker[role].length > 0
        ) {
          state.worker[role].forEach((worker) => {
            getReviews({ workerId: worker._id });
          });
        }
      });
    }
  }, []);

  const handleRecommendationPress = (item) => {
    // console.log(item);
    navigation.navigate("WPS_Client", { worker: item });
    // Implement navigation or other actions based on the selected worker
  };

  const capitalFirstLetter = (str) => {
    if (!str) return;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const renderWorkerList = () => {
    if (state.worker !== undefined) {
      const roles = Object.keys(state.worker);

      return roles.map((role) => (
        <View key={role}>
          {state.worker[role] &&
            Array.isArray(state.worker[role]) &&
            state.worker[role].length > 0 && (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: "row" }}
                >
                  {state.worker[role].map(
                    (worker) =>
                      worker.status !== "blocked" && (
                        <TouchableOpacity
                          key={worker._id}
                          style={styles.recommendationCard}
                          onPress={() => handleRecommendationPress(worker)}
                        >
                          <Text style={styles.subHeading}>
                            {capitalFirstLetter(`${role}:`)}
                          </Text>
                          <Image
                            source={require("../../assets/user.png")}
                            style={styles.recommendationImage}
                          />
                          <Text style={styles.recommendationTitle}>
                            {worker.username}
                          </Text>

                          <Text style={styles.recommendationDescription}>
                            {worker.role}
                          </Text>
                          <View style={{ alignItems: "center" }}>
                            <StarRating rating={worker.ratings} />
                          </View>
                        </TouchableOpacity>
                      )
                  )}
                </ScrollView>
              </>
            )}
        </View>
      ));
    }
  };

  const handleBidding = () => {
    navigation.navigate("Bidding");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Welcome to Your Home Page!</Text>
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsHeading}>Tips of the Week</Text>
          <View style={styles.line}></View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>{currentTip.title}</Text>

            <Text style={styles.tipDescription}>{currentTip.description}</Text>
          </View>
        </View>
        {renderWorkerList()}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem} onPress={handleBidding}>
          <Ionicons name="search" size={30} color="#00716F" />
          <Text>Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate("Proposal")}
        >
          <Ionicons name="add-circle" size={30} color="#00716F" />
          <Text>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate("AiOptionsScreen")}
        >
          <MaterialCommunityIcons
            name="robot-angry-outline"
            size={30}
            color="#00716F"
          />
          <Text>AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate("Notification")}
        >
          <Ionicons name="notifications-outline" size={30} color="#00716F" />
          <Text>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Ionicons name="person" size={30} color="#00716F" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    marginTop: 10,
    textAlign: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
    paddingBottom: 80, // Adjust paddingBottom to accommodate the bottom navigation bar
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    color: "#00716F",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 10,
    color: "#00716F",
  },
  recommendationCard: {
    width: 160,
    height: 240,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#00716F",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationImage: {
    width: "90%",
    height: "40%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    zIndex: 1,
  },
  bottomBarItem: {
    alignItems: "center",
  },
  tipsContainer: {
    backgroundColor: "#d3f5e9",
    marginBottom: 30,
    padding: 20,
    marginTop: 20,
  },
  tipsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipCard: {
    borderWidth: 1,
    borderColor: "#00716F",
    borderRadius: 10,
    padding: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  tipDescription: {
    fontSize: 14,
  },
  rating: {
    fontSize: 12,
    color: "#00716F",
    marginTop: 5,
  },
  line: {
    height: 1,
    backgroundColor: "black", // Color of the line
    marginVertical: 10,
  },
});

export default HomeScreen;
