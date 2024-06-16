import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Context as ProposalContext } from "../context/proposalContext";
import { Context as AuthContext } from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { state, acceptBid, rejectBid, fetchWorkerProposals, proposalBids } =
    useContext(ProposalContext);
  const { getUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchWorkerProposals();
      const id = await getUserId();
      setUserId(id);
      await proposalBids();
    };
    fetchData();
  }, []);

  const submitBid = async (action, proposalId, bidId, bidPrice) => {
    try {
      if (action === "accept") {
        Alert.alert(
          "Bid Acceptance",
          "Are you sure you want to accept the bid?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Accept",
              onPress: () => {
                acceptBid({ proposalId, bidId });
                removeBid(proposalId, bidId);
                navigation.navigate("HomeScreen");
                Alert.alert("Bid Accepted", `Bid Price: ${bidPrice}`);
              },
            },
          ]
        );
      } else if (action === "reject") {
        Alert.alert(
          "Bid Rejection",
          "Are you sure you want to reject the bid?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Reject",
              onPress: () => {
                rejectBid({ proposalId, bidId });
                removeBid(proposalId, bidId);
                navigation.navigate("HomeScreen");
                Alert.alert("Bid Rejected", `Bid Price: ${bidPrice}`);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      Alert.alert("Error", "An error occurred while submitting the bid.");
    }
  };

  const removeBid = (proposalId, bidId) => {
    const updatedProposal = state.proposal.map((proposal) => {
      if (proposal._id === proposalId) {
        return {
          ...proposal,
          bids: proposal.bids.filter((bid) => bid._id !== bidId),
        };
      }
      return proposal;
    });

    // Update state using proposalBids function from ProposalContext
    proposalBids(updatedProposal);
  };
  // console.log(state.proposal[0].bids);
  const navigateToBidderPage = (bidderId, reviewId) => {
    // console.log(reviewId);
    navigation.navigate("WorkerDetailScreen", {
      worker: bidderId,
      review: reviewId,
    });
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.heading}>Notifications</Text>

      <ScrollView>
        {state.proposal &&
          state.proposal.map(
            (proposal) =>
              proposal.bids &&
              proposal.userId === userId &&
              proposal.bids.map(
                (bid) =>
                  bid.status !== "accepted" &&
                  bid.status !== "rejected" && (
                    <View key={bid._id} style={styles.notificationItem}>
                      <TouchableOpacity
                        style={styles.notificationItem}
                        onPress={() =>
                          navigateToBidderPage(bid.userId, bid._id)
                        }
                      >
                        <Text style={styles.bidderName}>
                          Bid Name: {bid.bidderName}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.bidAmount}>
                        Bid Amount: {bid.price}
                      </Text>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.acceptButton]}
                          onPress={() =>
                            submitBid(
                              "accept",
                              proposal._id,
                              bid._id,
                              bid.price
                            )
                          }
                        >
                          <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.rejectButton]}
                          onPress={() =>
                            submitBid(
                              "reject",
                              proposal._id,
                              bid._id,
                              bid.price
                            )
                          }
                        >
                          <Text style={styles.buttonText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
              )
          )}
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
    color: "#00716F",
  },
  notificationItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#FFF",
  },
  bidderName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  bidAmount: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
});

export default NotificationsScreen;
