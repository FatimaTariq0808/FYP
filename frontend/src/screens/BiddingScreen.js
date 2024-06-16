import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import BackButton from "../Components/BackButton";
import { Context as ProposalContext } from "../context/proposalContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

const BiddingScreen = ({ route }) => {
  const { state, fetchProposals } = useContext(ProposalContext);
  // const { fetchProposals } = useContext(ProposalContext);
  // const { data } = route.params;
  // console.log(data[0].address);

  // console.log("Image:", data.image);
  // console.log("Card Data:", data.area);
  // console.log("Card Data:", data.bedrooms);
  // console.log("Card Data:", data.bathrooms);
  // console.log("Card Data:", data.address);
  // console.log("Card Data:", data.price);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);
  // const [proposals, setProposals] = useState(data.proposal);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set isLoading to true before starting to fetch new data
      await fetchProposals();
      setIsLoading(false); // Set isLoading to false after data is fetched
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <BackButton />
      {/* <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View> */}
      <ScrollView>
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
        {!isLoading && (
          <View>
            {state.proposal !== null ? (
              Array.isArray(state.proposal) && state.proposal.length > 0 ? (
                state.proposal.map((proposal, index) => (
                  <View key={index} style={styles.card}>
                    <Image
                      source={{ uri: proposal.image }}
                      style={styles.image}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.price}>Rs. {proposal.price}</Text>
                      <Text style={styles.address}>{proposal.address}</Text>
                      <Text style={styles.squareMeters}>
                        {proposal.area} sq.ft.
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Text style={styles.beds}>{proposal.bedroom} beds</Text>
                      <Text style={styles.baths}>
                        {proposal.bathroom} baths
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No proposals available</Text>
              )
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#f0f8ff",
    // padding: 10,
    marginBottom: 10,
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
    borderWidth: 1,
    borderColor: "#00716F",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
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
    height: CARD_WIDTH - 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
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

export default BiddingScreen;
