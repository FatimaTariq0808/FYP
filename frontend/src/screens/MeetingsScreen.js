import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Context as AuthContext } from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
import { Context as AppointmentContext } from "../context/appointmentContext";
import { Ionicons } from "@expo/vector-icons";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (timeString) => {
  const time = new Date(timeString);
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const MeetingBox = ({ name, date, time, onRemove }) => (
  <View style={styles.meetingBox}>
    <View style={styles.meetingInfo}>
      <Text style={styles.heading}>Meeting</Text>
      <Text style={styles.text}>Name: {name}</Text>
      <Text style={styles.text}>Date: {formatDate(date)}</Text>
      <Text style={styles.text}>Time: {formatTime(time)}</Text>
    </View>
    <TouchableOpacity onPress={onRemove}>
      <Text style={{ color: "blue" }}>Close</Text>
    </TouchableOpacity>
  </View>
);

const MeetingsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { state, getAppointments } = useContext(AppointmentContext);
  const { getUserId } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const { workerData } = route.params;
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    const loadData = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
        await getAppointments();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  const removeAppointment = (appointmentId) => {
    setDisplayedAppointments((prevAppointments) =>
      prevAppointments.filter(
        (appointment) => appointment._id !== appointmentId
      )
    );
  };

  useEffect(() => {
    if (state.appointemnt) {
      setDisplayedAppointments(state.appointemnt);
    }
  }, [state.appointemnt]);

  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handlePress} style={styles.barContainer}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            // marginTop={0}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.projectName}>Meetings</Text>
        {displayedAppointments &&
          displayedAppointments.map(
            (appointment) =>
              workerData._id === appointment.userId &&
              Array.isArray(appointment.appointments) &&
              appointment.appointments.map(
                (meeting) =>
                  meeting.clientId === userId &&
                  meeting.status === "accepted" && (
                    <MeetingBox
                      key={meeting._id}
                      name={workerData.username}
                      date={meeting.date}
                      time={meeting.time}
                      onRemove={() => removeAppointment(appointment._id)}
                    />
                  )
              )
          )}
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
  },
  meetingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00716F",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  meetingInfo: {
    flex: 1,
  },
  navbar: {
    height: 50,
    top: 40,
    right: 150,
    padding: 10,
    zIndex: 1,
  },
});

export default MeetingsScreen;
