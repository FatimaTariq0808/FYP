import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Context as ProposalContext } from "../context/proposalContext";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";

const months = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

const MonthlyReportScreen = ({ route }) => {
  const navigation = useNavigation();
  const [month, setMonth] = useState(null); // Initialize month state with null
  const [reportText, setReportText] = useState("");
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const { bidderId, projectId } = route.params;
  const { state, submitMonthlyReport } = useContext(ProposalContext);
  // console.log(bidderId, projectId);

  const handleSubmit = async () => {
    try {
      // console.log(month._index, reportText);
      submitMonthlyReport({
        userId: bidderId,
        projectId,
        monthlyReport: reportText,
        month: month.value,
      });

      // Submit the monthly report
      Alert.alert("Success", "Monthly report submitted successfully", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("WorkerHomeScreen");
          },
        },
      ]);
      setReportText(""); // Clear the report text input
    } catch (error) {
      Alert.alert("Error", "Failed to submit monthly report");
      console.error("Error submitting monthly report:", error);
    }
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          {/* {month ? month.label : ""} */}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <BackButton />
      <Text style={styles.heading}>Monthly Reports</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={months}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select month" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item);
          setMonth(item); // Set month based on the selected value
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
      <Text style={styles.label}>Monthly Report:</Text>
      <TextInput
        value={reportText}
        onChangeText={setReportText}
        multiline={true}
        numberOfLines={4}
        style={styles.input}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
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
  dropdownContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    height: 100,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  submitButton: {
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
export default MonthlyReportScreen;
