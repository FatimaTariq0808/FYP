import React, { useContext, useState, useEffect } from "react";
import { Context as AppointmentContext } from "../context/appointmentContext";
import { Context as AuthContext } from "../context/authContext";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BackButton from "../Components/BackButton";
import { ScrollView } from "react-native-gesture-handler";

const WorkerTransactionScreen = ({ route }) => {
  const { state, getAppointments } = useContext(AppointmentContext);

  const { getUserId, workerProfile } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);

  const { worker } = route.params;
  // console.log(worker);

  const [workerProfileData, setWorkerProfileData] = useState(null);
  const [appointmentUserProfileData, setAppointmentUserProfileData] =
    useState(null);
  const activityIndicatorColor = "#00716F";
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const moneyUserProfile = async (workerId) => {
      try {
        const profileData = await workerProfile({ id: workerId });
        setAppointmentUserProfileData(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    workerProfileData?._j?.money.forEach((money) => {
      moneyUserProfile(money.user);
    });
  }, [workerProfileData, workerProfile]);

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView>
        <Text style={styles.heading}>Transactions</Text>
        {workerProfileData?._j?.money.map((money) => (
          <View key={money._id} style={styles.card}>
            <FontAwesome5
              name="money-check"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.dateTime}>You received </Text>
            <Text style={styles.amount}>Rs.{money.amount}</Text>
            <Text style={styles.dateTime}>
              from{" "}
              {appointmentUserProfileData
                ? appointmentUserProfileData?.username
                : ""}
            </Text>
          </View>
        ))}
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
    alignItems: "center", // Center content horizontally
  },
  icon: {
    marginBottom: 10, // Add space between the icon and text
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WorkerTransactionScreen;
