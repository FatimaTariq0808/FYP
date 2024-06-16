import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Context as ProposalContext } from "../context/proposalContext";
import { Context as AuthContext } from "../context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const WorkerHomeScreen = () => {
  const navigation = useNavigation();
  const { state, fetchWorkerProposals } = useContext(ProposalContext);
  const { state: authState, getUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  // console.log(userId);
  useEffect(() => {
    const loadData = async () => {
      try {
        // await fetchWorkerProposals();

        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // console.log(state);
  // console.log(state.proposal[1]);

  const areaDemo = "200 sq. ft.";
  const expectedPriceDemo = "$50,000";
  const bedroomsDemo = 3;
  const bathroomsDemo = 2;

  const clientProjects = [
    {
      id: 1,
      clientName: "Fatima",
      projectName: "Project 1",
      projectDetails: {
        description: "Property in Johar Town.",
        area: "200 sq. ft.",
        location: "349-L Block Johar Town",
        expectedPrice: "Rs. 2,000,000",
        bedrooms: 5,
        bathrooms: 4,
      },
    },
    {
      id: 2,
      clientName: "Aaliyan",
      projectName: "Project 2",
      projectDetails: {
        description: "100 square feet property in Cantt",
        area: "100 sq. ft.",
        location: "359-F Block Cantt",
        expectedPrice: "Rs. 1,000,000",
        bedrooms: 3,
        bathrooms: 2,
      },
    },
  ];

  const [projects, setProjects] = useState(clientProjects);

  const capitalizeFirstLetter = (str) => {
    if (!str) {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  useEffect(() => {
    fetchWorkerProposals();
    // proposalBids();
  }, [fetchWorkerProposals]);
  const handleBidding = () => {
    navigation.navigate("BiddingSearchScreen");
  };
  // console.log(state.proposal);
  const renderProjectList = () => {
    let index = 0;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        {state.proposal?.map((proposal, index) =>
          proposal.bids.length === 0 ||
          proposal.bids[0].status === "pending" ? (
            <TouchableOpacity
              key={`${proposal._id}`}
              style={styles.projectCard}
              onPress={() =>
                navigation.navigate("BidToProposal", { proposal, index })
              }
            >
              {/* <Text>{console.log(proposal)}</Text> */}
              <Text style={styles.title}>Project </Text>
              <Text style={[styles.projectName, styles.bold]}>
                {capitalizeFirstLetter(proposal.username)}
              </Text>
              <Image
                source={{ uri: proposal?.image }}
                style={styles.projectImage}
              />
              {/* <Text style={styles.projectDescription}>
                <Text style={styles.bold}>Address: </Text>
                {`${capitalizeFirstLetter(proposal.address)}\n`}
                <Text style={styles.bold}>Area: </Text>
                {`${proposal.area}\n`}
                <Text style={styles.bold}>Price: </Text>
                {`${proposal.price}\n`}
                <Text style={styles.bold}>Bedrooms: </Text>
                {`${proposal.bedroom}\n`}
                <Text style={styles.bold}>Bathrooms: </Text>
                {`${proposal.bathroom}`}
              </Text> */}
              {/* {proposal.bids.map((bid, bidIndex) => (
                <Text key={`bid_${bidIndex}`}>Bid Status: {bid.status}</Text>
              ))} */}
            </TouchableOpacity>
          ) : (
            <Text key={`bid_${proposal._id}_${index}`}></Text>
          )
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome Home!</Text>

        <View style={styles.tipContainer}>
          <Text style={styles.tipHeading}>Tip of the Day</Text>
          <Text style={styles.tipText}>
            Always ensure to communicate effectively with clients to understand
            their project requirements thoroughly.
          </Text>
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.subHeading}>Your Projects:</Text>
          {renderProjectList()}
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        {/* <TouchableOpacity style={styles.bottomBarItem} onPress={handleBidding}>
          <Ionicons name="search" size={30} color="#00716F" />
          <Text>Search</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() =>
            navigation.navigate("WorkerProjectsScreen", {
              workerId: userId,
            })
          }
        >
          {/* <Ionicons name="notifications-outline" size={30} color="#00716F" />
           */}
          <Ionicons
            name="checkmark-done-circle"
            size={32}
            color="#00716F"
            marginRight={30}
          />
          <Text marginRight={30}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() =>
            navigation.navigate("WorkerAppointment", { worker: userId })
          }
        >
          {/* <Ionicons name="notifications-outline" size={30} color="#00716F" />
           */}
          <Ionicons
            name="call-sharp"
            size={30}
            color="#00716F"
            marginRight={25}
          />
          <Text marginRight={25}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() =>
            navigation.navigate("WorkerTransactionScreen", { worker: userId })
          }
        >
          <MaterialIcons name="attach-money" size={30} color="#00716F" />
          <Text>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => navigation.navigate("WorkerProfileScreen")}
        >
          <Ionicons name="person" size={30} color="#00716F" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    marginTop: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  subContainer: {
    flex: 1,
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#00716F",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#00716F",
  },
  projectCard: {
    width: 170,
    height: 270,
    marginRight: 15,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: 200,
    height: CARD_WIDTH - 150,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopLeftRadius: 20, // Rounded top left corner
    borderTopRightRadius: 20, // Rounded top right corner
    borderWidth: 1,
    borderColor: "#eee", // Lighter border color
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00716F",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  projectImage: {
    width: "100%",
    height: 100,
    marginBottom: 5,
    borderRadius: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: "#333",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomBarItem: {
    alignItems: "center",
    margin: 5,
  },
  bottomBarText: {
    color: "#00716F",
  },
  tipContainer: {
    backgroundColor: "#d3f5e9",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  tipHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00716F",
  },
  tipText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  username: {
    color: "#FF5733", // Example color
  },
  bold: {
    fontWeight: "bold",
  },
});

export default WorkerHomeScreen;
