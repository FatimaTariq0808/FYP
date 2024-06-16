import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Context as ProposalContext } from "../context/proposalContext";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import BackButton from "../Components/BackButton";

const months = [
  { label: "Select Month", value: null },
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

const ClientMonthlyReportScreen = ({ route }) => {
  const { state, getMonthlyReport } = useContext(ProposalContext);
  const { bidderId, projectId } = route.params;
  const [isFocus, setIsFocus] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [value, setValue] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const activityIndicatorColor = "#00716F";
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getMonthlyReport({ userId: bidderId, projectId });
  }, []);

  useEffect(() => {
    setAllReports(state.proposal);
  }, [state.proposal]);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = allReports.map((report) => ({
        ...report,
        monthlyReports: report.monthlyReports.filter(
          (item) => item.month === selectedMonth
        ),
      }));
      setFilteredReports(filtered);
    } else {
      setFilteredReports(allReports);
    }
  }, [selectedMonth, allReports]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          {selectedMonth ? selectedMonth.label : ""}
        </Text>
      );
    }
    return null;
  };

  const handleChange = (item) => {
    setSelectedMonth(item);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.heading}>Monthly Reports</Text>
      <View style={styles.dropdownContainer}>
        {renderLabel()}
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
            handleChange(item.value);
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
      </View>
      <View style={styles.reportContainer}>
        {filteredReports.map((reports) => {
          if (reports._id === projectId) {
            return (
              <View key={reports._id}>
                {reports.monthlyReports.map((report) => (
                  <View key={report._id} style={styles.report}>
                    <View style={styles.reportRow}>
                      <Text style={styles.reportText}>
                        Month: {report.month}
                      </Text>
                      <Text style={styles.reportText}>Year: {report.year}</Text>
                    </View>
                    <Text style={styles.reportText}>
                      Report: {report.reportText}
                    </Text>
                    <Text style={styles.reportText}>
                      Submitted At:{" "}
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }
        })}
        {filteredReports.length === 0 && (
          <Text>No reports available for this period</Text>
        )}
      </View>
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
    marginTop: 70,
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
  },
  label: {
    position: "absolute",
    left: 12,
    top: 4,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  reportContainer: {
    marginTop: 20,
  },
  report: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reportText: {
    fontSize: 16,
    marginBottom: 8,
    // color: "#00716F",
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});

export default ClientMonthlyReportScreen;
