import React, { useContext, useState, useEffect } from "react";
import { Context as AppointmentContext } from "../context/appointmentContext";
import { Context as AuthContext } from "../context/authContext";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import BackButton from "../Components/BackButton";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const WorkerAppointmentScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { state, acceptAppointment, getAppointments, rejectAppointment } =
    useContext(AppointmentContext);

  const { getUserId, workerProfile } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);

  const { worker } = route.params;
  // console.log(worker);

  const [workerProfileData, setWorkerProfileData] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [appointmentUserProfileData, setAppointmentUserProfileData] =
    useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(true);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);
  const counter = false;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
        const workerProfileData = workerProfile({ id: worker });
        setWorkerProfileData(workerProfileData);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      await getAppointments();
    };

    fetchAppointments();
  }, [getAppointments]);
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
  const handleAccept = async (appointmentId) => {
    Alert.alert(
      "Appointment Acceptance",
      "Are you sure you want to accept the appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            acceptAppointment({ appointmentId });
            navigation.navigate("WorkerHomeScreen");
          },
        },
      ]
    );
  };

  const handleReject = async (appointmentId) => {
    Alert.alert(
      "Appointment Rejection",
      "Are you sure you want to reject the appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: () => {
            rejectAppointment({ appointmentId });
            navigation.navigate("WorkerHomeScreen");
          },
        },
      ]
    );
  };
  useEffect(() => {
    if (isFocused) {
      const userProfile = async (workerId) => {
        try {
          const profileData = await workerProfile({ id: workerId });
          setUserProfileData(profileData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      state.appointemnt?.forEach((appointment) => {
        if (appointment.userId === userId) {
          appointment.appointments?.forEach((appointment) => {
            if (appointment.status !== "accepted") {
              userProfile(appointment.clientId);
            }
          });
        }
      });
    }
  }, [state.appointemnt, userId, workerProfile, isFocused]);

  // useEffect(() => {
  //   const moneyUserProfile = async (workerId) => {
  //     try {
  //       const profileData = await workerProfile({ id: workerId });
  //       setAppointmentUserProfileData(profileData);
  //     } catch (error) {
  //       console.error("Error fetching user profile:", error);
  //     }
  //   };
  //   workerProfileData?._j?.money.forEach((money) => {
  //     moneyUserProfile(money.user);
  //   });
  // }, [workerProfileData, workerProfile]);

  return (
    <View style={styles.container}>
      <BackButton />
      <View>
        <Text style={styles.heading}>Appointments</Text>
        {state.appointemnt &&
          state.appointemnt?.map(
            (appointemnt) =>
              appointemnt.userId === userId &&
              appointemnt.appointments?.map(
                (appointments) =>
                  appointments.status !== "accepted" &&
                  appointments.status !== "rejected" && (
                    <View key={appointemnt._id} style={styles.card}>
                      {/* {userProfile(appointments.clientId)} */}
                      <Text style={styles.name}>
                        {userProfileData ? userProfileData?.username : ""}

                        {/* {workerProfileData?._j?.username} */}
                      </Text>
                      <Text style={styles.dateTime}>
                        Date: {formatDate(appointments.date)}
                      </Text>
                      <Text style={styles.dateTime}>
                        Time: {formatTime(appointments.time)}
                      </Text>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.acceptButton]}
                          onPress={() => handleAccept(appointments._id)}
                        >
                          <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.rejectButton]}
                          onPress={() => handleReject(appointments._id)}
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
      </View>
      {/* <View style={styles.card}>
        {workerProfileData?._j?.money.map((money) => (
          <View key={money._id}>
            <Text style={styles.dateTime}>
              You received Rs.{money.amount} from{" "}
              {appointmentUserProfileData
                ? appointmentUserProfileData?.username
                : ""}
            </Text>
          </View>
        ))}
      </View> */}
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
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: "green",
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  transaction: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
});

export default WorkerAppointmentScreen;
