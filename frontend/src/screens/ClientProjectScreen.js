import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Context as ProposalContext } from "../context/proposalContext";
import { Context as AuthContext } from "../context/authContext";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const ClientProjectsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { state, proposalBids } = useContext(ProposalContext);
  const { getUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const { workerId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const activityIndicatorColor = "#00716F";
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // console.log(workerId);

  useEffect(() => {
    const loadData = async () => {
      try {
        // await fetchWorkerProposals();

        const id = await getUserId();
        setUserId(id);

        await proposalBids();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // console.log(userId);
  const capitalizeFirstLetter = (str) => {
    if (!str) {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView>
        <Text style={styles.title}>Your Projects</Text>
        <View style={styles.line}></View>
        {state.proposal &&
          state.proposal.map(
            (proposal, index) =>
              proposal.bids &&
              proposal.bids.map(
                (bid) =>
                  // bid.userId === userId ||
                  workerId === bid.userId &&
                  bid.status === "accepted" && (
                    <View key={bid._id} style={styles.card}>
                      <Text style={styles.projectName}>
                        {capitalizeFirstLetter(proposal.username)}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ClientMonthlyReportScreen", {
                            bidderId: bid.userId,
                            projectId: proposal._id,
                          })
                        }
                      >
                        <Image
                          source={{ uri: proposal?.image }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      <View style={styles.cardContent}>
                        <Text style={styles.price}>Rs. {proposal?.price}</Text>
                        <Text style={styles.address}>{proposal?.address}</Text>
                        <Text style={styles.squareMeters}>
                          {proposal?.area} sq.ft.
                        </Text>
                      </View>
                      <View style={styles.cardFooter}>
                        <Text style={styles.beds}>
                          {proposal?.bedroom} beds
                        </Text>
                        <Text style={styles.baths}>
                          {proposal?.bathroom} baths
                        </Text>
                      </View>
                    </View>
                  )
              )
          )}
      </ScrollView>
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00716F",

    marginTop: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#ccc", // Color of the line
    marginVertical: 10,
  },
  container: {
    flex: 1,
    paddingTop: 100,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#f0f8ff",
    // padding: 10,
    // marginBottom: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#00716F", // Dark green text color
  },
  projectDescription: {
    fontSize: 14,
    color: "#333", // Dark gray text color
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    marginTop: 40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    height: CARD_WIDTH - 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
    // padding: 20,
  },
  cardContent: {
    padding: 15,
  },
  price: {
    fontSize: 20,
    color: "#00716F",
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: "#00716F",
    marginBottom: 5,
  },
  squareMeters: {
    fontSize: 14,
    marginBottom: 5,
    color: "#00716F",
  },
  cardFooter: {
    padding: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "black",
    justifyContent: "space-between",
  },
  beds: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  baths: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00716F",
  },
});

export default ClientProjectsScreen;
