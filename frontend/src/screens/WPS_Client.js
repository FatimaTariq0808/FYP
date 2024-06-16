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
import WorkerProjectsScreen from "./WorkerProjects";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const WPS_Client = ({ route }) => {
  const navigation = useNavigation();
  const {
    state,
    userProfile,
    createReviews,
    getReviews,
    deleteReview,
    getUserId,
  } = useContext(AuthContext);
  // console.log("State", state.reviews.rating);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  const { worker } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);

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

  const handleProjects = () => {
    navigation.navigate("ClientProjectsScreen", { workerId: worker._id });
  };

  const handleAppointment = () => {
    navigation.navigate("Appointment", { worker: worker });
  };

  // console.log(worker);
  // console.log(worker);

  const workerProjects = [
    {
      id: 1,
      projectName: "Project 1",
      projectDetails: [
        {
          heading: "Description",
          value: "Property in Wapda Town.",
        },
        { heading: "Area", value: "200 sq. ft." },
        { heading: "Expected Price", value: "Rs.5,00,0000" },
        { heading: "No. of Bedrooms", value: "3" },
        { heading: "No. of Bathrooms", value: "2" },
      ],
    },
    {
      id: 2,
      projectName: "Project 2",
      projectDetails: [
        {
          heading: "Description",
          value: "Property in Lahore",
        },
        { heading: "Area", value: "150 sq. ft." },
        { heading: "Expected Price", value: "Rs.5,00,000" },
        { heading: "No. of Bedrooms", value: "2" },
        { heading: "No. of Bathrooms", value: "1" },
      ],
    },
    // Add more projects as needed
    // console.log(worker),
  ];

  const workerInfo = {
    avatarUri: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
    name: "Worker Name",
    email: "worker@example.com",
    location: "City, Country",
    bio: "I am passionate about turning your construction dreams into reality. Whether you're envisioning a new home, a commercial space, or a transformative renovation, I have the expertise and dedication to make it happen. Let's collaborate to build something extraordinary. ",
  };
  const handlePress = () => {
    navigation.goBack();
  };
  // const handleAppointment = () => {
  //   navigation.navigate("Appointment");
  // };

  useEffect(() => {
    userProfile();
    const reviewsData = getReviews({ workerId: worker._id });
    setReviewsData(reviewsData);
  }, []);
  // console.log(reviewsData);

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // console.log(state.userId);
  const handleRatingSubmit = async () => {
    await createReviews({ rating, comment, workerId: worker._id });
  };
  const handleDeleteReview = async (reviewId) => {
    await deleteReview({ reviewId });
    {
      isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      );
    }
    getReviews({ workerId: worker._id });
    navigation.navigate("HomeScreen");
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
                  <TouchableOpacity
                    style={styles.sidebarOption}
                    onPress={handleAppointment}
                  >
                    <Text
                      style={[styles.sidebarOptionText, styles.verticalText]}
                    >
                      Appointment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* <TouchableOpacity
            onPress={toggleOptions}
            style={styles.threeContainer}
          >
            <AntDesign name="bars" size={24} color="#004d40" />
          </TouchableOpacity>
          {showOptions && (
            <View>
              <TouchableOpacity
                style={styles.bidButton}
                onPress={() =>
                  navigation.navigate("WorkerProjectsScreen", {
                    workerId: worker._id,
                  })
                }
              >
                <Text style={styles.bidButtonText}>Projects</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bidButton}
                onPress={() =>
                  navigation.navigate("Appointment", { worker: worker._id })
                }
              >
                <Text style={styles.bidButtonText}>Schedule Appointment</Text>
              </TouchableOpacity>
            </View>
          )} */}
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/user.png")}
              style={styles.avatar}
            />
            <Text style={styles.name}>{worker.username}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{worker.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{worker.address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoValue}>{workerInfo.bio}</Text>
          </View>
          {/*
          <View style={styles.projectsContainer}>
            <Text style={styles.projectsHeading}>Projects</Text>
            <FlatList
              data={workerProjects}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.projectCard}>
                  <Text style={styles.projectName}>{item.projectName}</Text>
                  <FlatList
                    data={item.projectDetails}
                    keyExtractor={(detail) => detail.heading}
                    renderItem={({ item: detail }) => (
                      <View style={styles.projectDetail}>
                        <Text style={styles.detailHeading}>
                          {detail.heading}:
                        </Text>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
            />
          </View> */}

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsHeading}>Reviews</Text>
            {reviewsData?._j?.reviews.map((review, index) => (
              <View key={index} style={styles.review}>
                <Text style={styles.name}>Name: {review.name}</Text>
                <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
                <Text style={styles.reviewComment}>
                  Comment: {review.comment}
                </Text>
                {/* <Text>{console.log(userId, review.user)}</Text> */}
                {userId === review.user && (
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      { marginTop: -30, alignSelf: "flex-end" },
                    ]}
                    onPress={() => handleDeleteReview(review._id)}
                  >
                    {/* <Text>{console.log(review._id)}</Text> */}
                    <AntDesign name="delete" size={24} color="orange" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate this worker:</Text>
            {/* Display stars for rating */}
            <Ionicons
              name="star"
              size={24}
              color={rating >= 1 ? "orange" : "gray"}
              onPress={() => setRating(1)}
            />
            <Ionicons
              name="star"
              size={24}
              color={rating >= 2 ? "orange" : "gray"}
              onPress={() => setRating(2)}
            />
            <Ionicons
              name="star"
              size={24}
              color={rating >= 3 ? "orange" : "gray"}
              onPress={() => setRating(3)}
            />
            <Ionicons
              name="star"
              size={24}
              color={rating >= 4 ? "orange" : "gray"}
              onPress={() => setRating(4)}
            />
            <Ionicons
              name="star"
              size={24}
              color={rating >= 5 ? "orange" : "gray"}
              onPress={() => setRating(5)}
            />
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment (optional)"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRatingSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    backgroundColor: "#f0f8ff", // Green texture background color
    padding: 20,
    // position: "relative",
  },
  deleteButton: {
    flexDirection: "row-reverse",
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
    flexDirection: "row",

    // backgroundColor: "#004d40",
  },
  verticalText: {
    writingDirection: "rtl", // Text direction right-to-left
    // transform: [{ rotate: "270deg" }], // Rotate text vertically
  },
  // sidebar: {
  //   backgroundColor: "#f0f8ff",
  //   width: "65%", // Adjust width as needed
  //   height: "100%",
  //   justifyContent: "flex-start",
  //   position: "absolute",

  //   right: 0,
  //   top: 0, // Position at the top
  // },
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
    height: 100,
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
    textDecorationLine: "underline",
  },
  infoValue: {
    marginTop: 5,
    color: "black",
  },
  barContainer: {
    flex: 1,
    // backgroundColor: "#004d40",
  },
  navbar: {
    height: 50,
    top: 20,
    left: 10,
    padding: 10,
    // zIndex: 1,
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
    textDecorationLine: "underline",
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

export default WPS_Client;
