// console.disableYellowBox = true;

// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   TextInput,
//   Button,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { ScrollView } from "react-native-gesture-handler";
// import { ActivityIndicator } from "react-native";
// import * as Notifications from "expo-notifications";
// import NotificationAlert from "../Components/NotificationAlert";
// import BackButton from "../Components/BackButton";

// const TransactionScreen = () => {
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [cardNumber, setCardNumber] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [cvc, setCvc] = useState("");
//   const [recipient, setRecipient] = useState("");
//   const [notification, setNotification] = useState(null);

//   const navigation = useNavigation();

//   useEffect(() => {
//     Notifications.requestPermissionsAsync();
//   }, []);

//   const isFutureDate = (date) => {
//     const currentDate = new Date();
//     return date > currentDate;
//   };

//   const handleDateConfirm = (date) => {
//     if (isFutureDate(date)) {
//       setExpirationDate(date);
//     } else {
//       setNotification("Please select a future date.");
//     }
//     hideDatePicker();
//   };

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleNotificationPress = () => {
//     setNotification(null);
//   };

//   useEffect(() => {
//     if (notification) {
//       const timeoutId = setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [notification]);

//   const handleCardNumberChange = (text) => {
//     setCardNumber(text.replace(/[^0-9]/g, "").replace(/(\d{4})(?=\d)/g, "$1 "));
//   };

//   const handlePress = () => {
//     // console.log("Card Number:", cardNumber);
//     // console.log("Expiration Date:", expirationDate);
//     // console.log("CVC:", cvc);
//     // console.log("Recipient:", recipient);
//     setCardNumber("");
//     setCvc("");
//     setRecipient("");
//     setExpirationDate("");
//     navigation.navigate("HomeScreen");
//   };
//   const handleCVC = (text) => {
//     const numericValue = text.replace(/[^0-9]/g, "");
//     setCvc(${numericValue});
//   };
//   return (
//     <ImageBackground
//       source={require("../../assets/creditCard.jpg")}
//       style={styles.imageStyle}
//       onLoad={() => setImageLoaded(true)}
//     >
//       <BackButton />
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View style={styles.container}>
//           {!imageLoaded ? (
//             <ActivityIndicator size="large" color="#00716F" />
//           ) : (
//             <>
//               <Text style={styles.heading}>Transaction System</Text>

//               <TextInput
//                 placeholder="Card Number"
//                 value={cardNumber}
//                 onChangeText={handleCardNumberChange}
//                 keyboardType="numeric"
//                 maxLength={19}
//                 placeholderTextColor="#FFF"
//                 style={styles.input}
//               />

//               <TextInput
//                 placeholder="CVC"
//                 value={cvc}
//                 onChangeText={(text) => handleCVC(text)}
//                 keyboardType="numeric"
//                 maxLength={3} // 3 characters
//                 placeholderTextColor="#FFF"
//                 style={styles.input}
//               />
//               <View style={styles.cardInfoContainer}>
//                 <View style={styles.cardInfoItem}>
//                   <Text style={styles.cardInfoLabel}>Card Holder</Text>
//                   <TextInput
//                     placeholder="Recipient"
//                     value={recipient}
//                     onChangeText={(text) => setRecipient(text)}
//                     placeholderTextColor="#FFF"
//                     style={styles.cardInfoValue}
//                   />
//                 </View>
//                 <View style={styles.cardInfoItem}>
//                   <TouchableOpacity onPress={showDatePicker}>
//                     <Text style={styles.cardInfoLabelExpiration}>
//                       Expiration
//                     </Text>
//                   </TouchableOpacity>
//                   <DateTimePickerModal
//                     isVisible={isDatePickerVisible}
//                     mode="date"
//                     onConfirm={handleDateConfirm}
//                     onCancel={hideDatePicker}
//                   />
//                   {expirationDate && (
//                     <Text style={styles.cardInfoValueExpiration}>
//                       {expirationDate.toDateString()}
//                     </Text>
//                   )}
//                 </View>
//               </View>

//               <TouchableOpacity style={styles.button} onPress={handlePress}>
//                 <Text style={styles.buttonText}>Submit</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {notification && (
//             <NotificationAlert
//               message={notification}
//               onPress={handleNotificationPress}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     marginTop: 40,
//   },
//   cardInfoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   cardInfoItem: {
//     // flex: 1,
//   },
//   cardInfoLabel: {
//     fontSize: 18,
//     color: "white",
//   },
//   cardInfoLabelExpiration: {
//     fontSize: 18,
//     color: "white",
//     marginTop: 3,
//   },
//   cardInfoValue: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "white",
//     marginTop: 10,
//   },
//   cardInfoValueExpiration: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "white",
//     marginTop: 12,
//   },
//   selectedDateTime: {
//     fontSize: 16,
//     color: "black",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   imageStyle: {
//     flex: 1,
//   },
//   input: {
//     marginBottom: 20,
//     borderBottomWidth: 0.5,
//     borderColor: "#00716F",
//     borderWidth: 2,
//     padding: 15,
//     backgroundColor: "rgba(169, 169, 169, 0.3)",
//     borderRadius: 20,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   inputDate: {
//     width: 200,
//     textAlign: "center",
//     marginLeft: 70,
//     marginBottom: 20,
//     borderBottomWidth: 0.5,
//     borderColor: "#00716F",
//     borderWidth: 2,
//     padding: 20,

//     backgroundColor: "rgba(169, 169, 169, 0.3)",
//     borderRadius: 20,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   heading: {
//     fontSize: 36,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#fff",
//     textShadowColor: "#000",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 5,
//   },
//   button: {
//     backgroundColor: "#00716F",
//     borderRadius: 10,
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     marginTop: 50,
//     width: "60%",
//     marginLeft: 70,

//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//     backgroundColor: "#00716F",
//     // width: "40%",
//     flex: 1,
//     textAlign: "center",
//     textAlignVertical: "center",
//   },
// });

// export default TransactionScreen;
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import {
  CardField,
  useConfirmPayment,
  confirmCardPayment,
} from "@stripe/stripe-react-native";
import BackButton from "../Components/BackButton";

import { Context as AuthContext } from "../context/authContext";

const TransactionScreen = ({ route }) => {
  const [cardDetails, setCardDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const { processPayment } = useContext(AuthContext);
  const { workerId } = route.params;
  // console.log(workerId.username);
  const { confirmPayment, loading } = useConfirmPayment();
  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !amount) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    Alert.alert("Payment Successfull.");
  };

  return (
    <ImageBackground
      source={require("../../assets/creditCard.jpg")}
      style={styles.background}
    >
      <BackButton />
      <View style={styles.container}>
        <Text style={styles.heading}>Transaction System</Text>

        <TextInput
          placeholder={`Amount to ${workerId.username}`}
          keyboardType="numeric"
          onChangeText={(value) => setAmount(parseFloat(value))}
          style={styles.input}
        />
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          // cardStyle={styles.card}
          style={styles.cardContainer}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />

        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            // navigation.navigate("WorkerHomeScreen");
            processPayment({ amount, workerId });
            handlePayPress();
          }}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 18,
    height: 50,
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardContainer: {
    height: 50,
    width: "100%",
    // flexDirection: "column",
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: "#00716F",
    borderRadius: 8,
    marginTop: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    flex: 0.2,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default TransactionScreen;
