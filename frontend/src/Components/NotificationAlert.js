import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const NotificationAlert = ({ message, onPress }) => {
  return (
    <TouchableOpacity style={styles.notification} onPress={onPress}>
      <Text style={styles.notificationText}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "orange",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
  },
});

export default NotificationAlert;
