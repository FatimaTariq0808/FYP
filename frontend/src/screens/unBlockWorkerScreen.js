import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import StarRating from "../Components/StarRating";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Context as AuthContext } from "../context/authContext";
import BackButton from "../Components/BackButton";

const UnBlockWorkerScreen = () => {
  const navigation = useNavigation();
  const { state, fetchWorkers, unblockWorker } = useContext(AuthContext);

  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await fetchWorkers();
        // console.log(state.worker);
      }
    };

    fetchData();
  }, [isFocused, fetchWorkers]);

  const handleUnblockWorker = async (worker) => {
    // You can customize the alert message and actions as needed
    Alert.alert(
      "Unblock Worker",
      "Are you sure you want to unblock this worker?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unblock",
          onPress: () => {
            unblockWorker({ id: worker._id });
            navigation.navigate("AdminHomeScreen");
          },
        },
      ]
    );
  };

  const capitalFirstLetter = (str) => {
    if (!str) return;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderWorkerList = () => {
    if (state.worker !== undefined) {
      const roles = Object.keys(state.worker);

      return roles.map((role) => (
        <View key={role}>
          {state.worker[role] &&
            Array.isArray(state.worker[role]) &&
            state.worker[role].length > 0 && (
              <>
                {state.worker[role].map((worker) => (
                  <View key={worker._id}>
                    {worker.status === "blocked" && (
                      <View key={worker._id} style={styles.card}>
                        <Text style={styles.subHeading}>
                          {capitalFirstLetter(`${role}s:`)}
                        </Text>
                        <View style={styles.workerInfo}>
                          <Text style={styles.workerName}>
                            {worker.username}
                          </Text>
                          <StarRating
                            style={styles.rating}
                            rating={worker.ratings}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.unblockButton}
                          onPress={() => handleUnblockWorker(worker)}
                        >
                          <Text style={styles.buttonText}>Unblock</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
        </View>
      ));
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.heading}>Unblock Worker</Text>

      <ScrollView>{renderWorkerList()}</ScrollView>
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
    marginTop: 70,
    marginBottom: 30,
    color: "#00716F",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#00716F",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  workerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  unblockButton: {
    backgroundColor: "#00716F",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UnBlockWorkerScreen;
