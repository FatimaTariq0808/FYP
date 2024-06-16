import React from "react";
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const ScheduleMeetingScreen = () => {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/bg.png")}
        resizeMode="stretch"
        style={styles.img}
      >
        <TextInput placeholder="Geeks for Geeks" style={styles.input} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
  },
});
export default ScheduleMeetingScreen;
