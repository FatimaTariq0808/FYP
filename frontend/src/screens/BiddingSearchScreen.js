import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const propertyData = [
  {
    id: "1",
    image: "https://source.unsplash.com/900x900/?house",
    price: "Rs. 250,000",
    address: "123 Johar Town",
    squareMeters: "150",
    beds: "3",
    baths: "2",
    parking: "1",
  },
  {
    id: "2",
    image: "https://source.unsplash.com/900x900/?apartment",
    price: "Rs. 400,000",
    address: "44 Cantt",
    squareMeters: "200",
    beds: "4",
    baths: "3",
    parking: "2",
  },
  {
    id: "3",
    image: "https://source.unsplash.com/900x900/?house+front",
    price: "Rs. 150,000",
    address: "789 PIA",
    squareMeters: "100",
    beds: "2",
    baths: "1",
    parking: "0",
  },
  {
    id: "4",
    image: "https://source.unsplash.com/900x900/?small+house",
    price: "Rs. 150,000",
    address: "78 Wapda Town",
    squareMeters: "100",
    beds: "2",
    baths: "1",
    parking: "0",
  },
];

const BiddingSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };
  const handlePress = () => {
    navigation.goBack();
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.squareMeters}>{item.squareMeters} sq. ft.</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.beds}>{item.beds} beds</Text>
        <Text style={styles.baths}>{item.baths} baths</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredData = propertyData.filter((item) => {
    return item.address.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handlePress} style={styles.barContainer}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.propertyListContainer}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#f0f8ff",
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  barContainer: {
    flex: 1,
    // backgroundColor: "#004d40",
  },
  navbar: {
    height: 50,
    // top: 20,
    left: 10,
    padding: 10,
    // zIndex: 1,
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
  propertyListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: 150,
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  squareMeters: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  cardFooter: {
    padding: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#dcdcdc",
    justifyContent: "space-between",
  },
  beds: {
    fontSize: 14,
    color: "#ffa500",
    fontWeight: "bold",
  },
  baths: {
    fontSize: 14,
    color: "#ffa500",
    fontWeight: "bold",
  },
  parking: {
    fontSize: 14,
    color: "#ffa500",
    fontWeight: "bold",
  },
});

export default BiddingSearchScreen;
