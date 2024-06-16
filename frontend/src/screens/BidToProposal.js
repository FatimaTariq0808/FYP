import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import BackButton from "../Components/BackButton";
import Modal from "react-native-modal";
import { Context as ProposalContext } from "../context/proposalContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const BidToProposal = ({ route }) => {
  const { state, submitBid: bidSubmit } = useContext(ProposalContext);
  const { proposal, index } = route.params;
  const [bidPrice, setBidPrice] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBidButtonPressed, setBidButtonPressed] = useState(false);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setBidButtonPressed(false);
    setBidPrice("");
  };

  const handleBidPress = () => {
    setBidButtonPressed(true);
    toggleModal();
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const submitBid = (action, proposalId, bidId) => {
    if (bidPrice) {
      const updatedProposal = {
        ...proposal,
        bidAmount: bidPrice,
      };

      // Perform the action (accept or reject) based on the provided action parameter
      if (action === "accept") {
        acceptBid({ proposalId, bidId });
        Alert.alert("Bid Accepted", `Bid Price: ${bidPrice}`);
      } else if (action === "reject") {
        rejectBid({ proposalId, bidId });
        Alert.alert("Bid Rejected", `Bid Price: ${bidPrice}`);
      }
    } else {
      Alert.alert("Bid Canceled", "You canceled the bid.");
    }
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.card}>
        <Text style={styles.mainHeading}>{`Project`}</Text>
        <Text style={styles.clientName}>
          {capitalizeFirstLetter(proposal.username)}
        </Text>
        <Image source={{ uri: proposal?.image }} style={styles.image} />
        <View style={styles.line}></View>
        <Text style={styles.detailsText}>
          <Text style={styles.highlight}>Area:</Text> {proposal.area}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.highlight}>Address:</Text> {proposal.address}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.highlight}>Expected Price: </Text>
          {proposal.price}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.highlight}>Bedrooms: </Text>
          {proposal.bedroom}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.highlight}>Bathrooms:</Text>
          {proposal.bathroom}
        </Text>
        <TouchableOpacity
          style={[
            styles.bidButton,
            isBidButtonPressed && styles.bidButtonPressed,
          ]}
          onPress={handleBidPress}
        >
          <Text style={styles.bidButtonText}>Bid Now</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Enter Bid Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Bid Price"
            keyboardType="numeric"
            value={bidPrice}
            onChangeText={setBidPrice}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              bidSubmit({ proposalId: proposal._id, bidPrice });
              toggleModal();
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
    justifyContent: "center",
    justifyContent: "flex-start", // Align content at the top
    // marginTop: 50,
    position: "relative", // Add relative positioning
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 100,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainHeading: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: CARD_WIDTH - 50,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 10, // Add border radius for rounded edges
  },
  line: {
    height: 1,
    backgroundColor: "#ccc", // Color of the line
    marginVertical: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  highlight: {
    fontWeight: "bold",
    color: "#00716F",
  },
  backButton: {
    position: "absolute", // Use absolute positioning
    top: 20, // Adjust top position as needed
    left: 20, // Adjust left position as needed
    zIndex: 1,
  },
  bidButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  bidButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    height: CARD_WIDTH - 80,
    width: CARD_WIDTH - 50,
    alignSelf: "center",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
    // flex: 1,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#00716F",
    borderWidth: 2,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "bold",
  },
});

export default BidToProposal;
