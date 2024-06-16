import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Context as AuthContext } from "../context/authContext";
import { AntDesign } from "@expo/vector-icons";

const WorkerDetail = ({ route }) => {
  const navigation = useNavigation();
  const {
    state,
    workerProfile,
    createReviews,
    getReviews,
    deleteReview,
    getUserId,
  } = useContext(AuthContext);
  // console.log("State", state.reviews.rating);
  const { worker, review } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [workerProfileData, setWorkerProfileData] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  //   console.log(worker, review);

  // Add more projects as needed

  const workerInfo = {
    avatarUri: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
    name: workerProfileData?._j?.username,
    email: workerProfileData?._j?.email,
    location: workerProfileData?._j?.address,
    bio: "I am passionate about turning your construction dreams into reality. Whether you're envisioning a new home, a commercial space, or a transformative renovation, I have the expertise and dedication to make it happen. Let's collaborate to build something extraordinary. ",
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsSidebarOpen(false);
    }, [])
  );
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //   console.log(workerInfo.name);
  const handlePress = () => {
    navigation.goBack();
  };
  const handleProjects = () => {
    navigation.navigate("WorkerProjectsScreen", {
      workerId: workerProfileData?._j?._id,
    });
    // console.log(workerProfileData?._j?._id);
  };

  const handleAppointment = () => {
    navigation.navigate("Appointment", { worker: worker._id });
  };

  //   console.log(state.reviews);

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = await getUserId();
        setUserId(id);

        const workerProfileData = workerProfile({ id: worker });
        setWorkerProfileData(workerProfileData);

        const reviewsData = await getReviews({ workerId: worker });
        setReviewsData(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  //   console.log(workerProfileData?._j?.username);
  const handleRatingSubmit = async () => {
    await createReviews({ rating, comment, workerId: worker });
  };
  const handleDeleteReview = async (reviewId) => {
    await deleteReview({ reviewId });
    getReviews({ workerId: worker });
  };

  return (
    <FlatList
      data={[{ key: "profile" }]}
      renderItem={({ item }) => (
        <View key={item.key} style={styles.container}>
          <View style={styles.navbar}>
            <TouchableOpacity onPress={handlePress} style={styles.barContainer}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                marginTop={10}
                color="#004d40"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sidebar}>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.sidebarToggle}
            >
              <AntDesign name="bars" size={24} color="#004d40" />
            </TouchableOpacity>
            {isSidebarOpen && (
              <View style={styles.sidebarContent}>
                <View style={styles.sidebarCard}>
                  <TouchableOpacity
                    style={styles.sidebarOption}
                    onPress={handleProjects}
                  >
                    <Text style={styles.sidebarOptionText}>Projects</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={styles.sidebarOption}
                    onPress={handleAppointment}
                  >
                    <Text
                      style={[styles.sidebarOptionText, styles.verticalText]}
                    >
                      Appointment
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
          </View>
          <View style={styles.avatarContainer}>
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

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsHeading}>Reviews</Text>
            {state.reviews?.reviews?.map((review, index) => (
              <View key={index} style={styles.review}>
                <Text style={styles.name}>Name: {review.name}</Text>
                <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
                <Text style={styles.reviewComment}>
                  Comment: {review.comment}
                </Text>
              </View>
            ))}
          </View>
          {isLoading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={activityIndicatorColor} />
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Green texture background color
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  container1: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  navbarLogOut: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    paddingTop: 10,
  },
  barContainerLogOut: {
    flexDirection: "row",
    alignItems: "center",
  },
  barText: {
    marginLeft: 5,
  },
  barContainer: {
    flex: 1,
    // backgroundColor: "#004d40",
  },
  sidebarContent: {
    marginTop: -50, // Adjust top margin as needed
    marginLeft: 30,
    alignItems: "center",
  },
  sidebarOption: {
    paddingVertical: 10,
  },
  sidebar: {
    backgroundColor: "#f0f8ff",
    //   width: "65%", // Adjust width as needed
    //   height: "100%",
    // justifyContent: "flex-start",
    position: "absolute",

    right: 0,
    top: 0, // Adjust top position as needed
  },
  sidebarCard: {
    backgroundColor: "#fff",
    // borderRadius: 10,
    elevation: 5, // For Android shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 100,
    height: 50,
    padding: 3,
    // marginRight: 10,
    // alignItems: "flex-end",
    alignItems: "center",
  },
  sidebarOptionText: {
    fontSize: 16,
    color: "#004d40",
  },
  sidebarToggle: {
    alignItems: "center",
    paddingVertical: 60,
    paddingLeft: 80,
    paddingRight: 25,
  },

  navbar: {
    height: 50,
    top: 20,
    left: 10,
    padding: 10,
    // zIndex: 1,
  },
  avatar: {
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
  },
  infoValue: {
    marginTop: 5,
    color: "black",
  },
  barContainer: {
    flex: 1,
    // backgroundColor: "#004d40",
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
  bidButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  bidButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bidButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  bidButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ratingLabel: {
    marginRight: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00716F",
    marginBottom: 10,
  },
  review: {
    backgroundColor: "#d3f5e9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  reviewRating: {
    fontWeight: "bold",
    color: "#00716F",
  },
  reviewComment: {
    marginTop: 5,
  },
});

export default WorkerDetail;
