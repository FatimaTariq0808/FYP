import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert, // Import Alert from react-native
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NotificationAlert from "../Components/NotificationAlert";
import * as Notifications from "expo-notifications";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Context as AppointmentContext } from "../context/appointmentContext";
import { Context as AuthContext } from "../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const AppointmentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { submitAppointment } = useContext(AppointmentContext);

  const { worker } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  const activityIndicatorColor = "#00716F";
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const isFutureDate = (date) => {
    const currentDate = new Date();
    return date > currentDate;
  };

  const handleDateConfirm = (date) => {
    if (isFutureDate(date)) {
      setSelectedDate(date);
    } else {
      setNotification("Please select a future date.");
    }
    hideDatePicker();
  };

  const isFutureTime = (time) => {
    const currentTime = new Date();
    const selectedDateTime = new Date(time);
    return selectedDateTime > currentTime;
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleNotificationPress = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timeoutId = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [notification]);

  const handleTransaction = () => {
    navigation.navigate("Transaction", { workerId: worker });
  };

  const handleViewMeetings = () => {
    navigation.navigate("MeetingsScreen", {
      workerData: worker,
      selectedDate,
      selectedTime,
    });
  };

  const handlePress = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      setIsSidebarOpen(false);
    }, [])
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAppointment = () => {
    Alert.alert("Appointment Confirmed", "Your appointment has been fixed.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperHalf}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={handlePress} style={styles.barContainer}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              marginTop={10}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebar}>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={styles.sidebarToggle}
          >
            <AntDesign name="bars" size={24} color="black" />
          </TouchableOpacity>
          {isSidebarOpen && (
            <View style={styles.sidebarContent}>
              <View style={styles.sidebarCard}>
                <TouchableOpacity
                  style={styles.sidebarOption}
                  onPress={handleTransaction}
                >
                  <Text style={styles.sidebarOptionText}>Transaction</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sidebarOption}
                  onPress={handleViewMeetings}
                >
                  <Text style={styles.sidebarOptionText}>View Meetings</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Text style={styles.heading}>Schedule {`\n`}Appointment</Text>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePhoto}
            source={require("../../assets/user.png")}
          />
          <Text style={styles.nameText}>{worker.username}</Text>
        </View>
      </View>
      <View style={styles.lowerHalf} />

      <Text style={styles.subHeading}>Date and Time</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.cardInfoContainer}>
          <View style={styles.cardInfoItem}>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.cardInfoLabel}>Pick Date</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
            {selectedDate && (
              <View style={styles.cardInfoValueContainer}>
                <Text style={styles.cardInfoValue}>
                  {selectedDate.toDateString()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.cardInfoItem}>
            <TouchableOpacity onPress={showTimePicker}>
              <Text style={styles.cardInfoLabelExpiration}>Pick Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
            {selectedTime && (
              <View style={styles.cardInfoValueExpirationContainer}>
                <Text style={styles.cardInfoValueExpiration}>
                  {selectedTime.toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          submitAppointment({
            workerId: worker._id,
            selectedDate,
            selectedTime,
          });
          handleAppointment();
        }}
      >
        <Text style={styles.submitButtonText}>Submit Appointment</Text>
      </TouchableOpacity>

      {notification && (
        <NotificationAlert
          message={notification}
          onPress={handleNotificationPress}
        />
      )}
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
  },
  upperHalf: {
    flex: 2.6,
    backgroundColor: "#00716F",
    width: "100%",
  },
  lowerHalf: {
    flex: 0.2,
    width: "100%",
  },
  cardInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfoItem: {
    // flex: 1,
  },
  cardInfoLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00716F",
    marginRight: 150,
    marginTop: 80,
  },
  cardInfoLabelExpiration: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00716F",
    marginTop: 78,
  },
  cardInfoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00716F",
    marginTop: 12,
  },
  cardInfoValueExpiration: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00716F",
    marginTop: 14,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#00716F",
  },
  heading: {
    fontSize: 25,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginTop: 130,
    marginBottom: 25,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00716F",
    marginTop: 100,
  },
  buttonContainer: {
    flex: 2,
    justifyContent: "space-between",
  },
  selectedDateTime: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00716F",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 50,
    width: "60%",
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
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
    backgroundColor: "#00716F",
    position: "absolute",
    right: 0,
    top: 0, // Adjust top position as needed
  },
  sidebarCard: {
    backgroundColor: "#fff",
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
    top: 40,
    left: 10,
    padding: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#00716F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default AppointmentScreen;
