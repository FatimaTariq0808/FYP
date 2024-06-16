// // BiddingList.js
// import React from "react";
// import {
//   View,
//   FlatList,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import BiddingPageScreen from "./BiddingPageScreen";

// const BiddingListScreen = () => {
//   const navigation = useNavigation();
//   const data = [
//     // Your bidding data goes here
//     {
//       id: 1,
//       bidName: "Bid 1",
//       bidDescription: "Description 1",
//       bidImage: "../../assets/Client.png",
//       numBidders: 3,
//       timeLeft: 3600,
//     },
//     // Add more bidding items as needed
//   ];

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => navigation.navigate("BiddingPage", item)}>
//       <View>
//         <Text style={styles.container}>{item.bidName}</Text>
//         {/* Add more information about the bid as needed */}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderItem}
//     />
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     marginTop: 100,
//   },
// });
// export default BiddingListScreen;
