import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import api from "../api/api";
import moment from "moment";

const appointmentReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { errorMessage: " ", errorMessage: action.payload };
    case "submit_appointment":
      return action.payload;
    case "accept_appointment":
      return action.payload;
    default:
      return state;
  }
};

const submitAppointment =
  (dispatch) =>
  async ({ workerId, selectedDate, selectedTime }) => {
    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const formattedTime = moment(selectedTime, "HH:mm:ss").format("HH:mm:ss");
      const convertedDateTime = moment(`${formattedDate} ${formattedTime}`).add(
        5,
        "hours"
      );

      // console.log(formattedDate, formattedTime);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/submitAppointment",
        {
          workerId,
          selectedDate: formattedDate,
          selectedTime: convertedDateTime.format("HH:mm:ss"),
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // console.log(selectedDate, selectedTime);
      // navigate("HomeScreen");
      dispatch({
        type: "submit_appointment",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Cannot submit appointemnt.",
      });
    }
  };

const acceptAppointment =
  (dispatch) =>
  async ({ appointmentId }) => {
    try {
      // console.log(appointmentId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/acceptAppointment",
        {
          appointmentId,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      dispatch({
        type: "accept_appointment",
        payload: response.data,
      });
      // navigate("WorkerHomeScreen");
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Cannot accept appointemnt.",
      });
    }
  };

const rejectAppointment =
  (dispatch) =>
  async ({ appointmentId }) => {
    try {
      // console.log(appointmentId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/rejectAppointment",
        {
          appointmentId,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      dispatch({
        type: "submit_appointment",
        payload: response.data,
      });
      // navigate("WorkerHomeScreen");
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Cannot accept appointemnt.",
      });
    }
  };

const getAppointments = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const response = await api.get("/getAppointments", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    dispatch({
      type: "submit_appointment",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Cannot accept appointemnt.",
    });
  }
};

export const { Provider, Context } = createDataContext(
  appointmentReducer,
  {
    submitAppointment,
    acceptAppointment,
    getAppointments,
    rejectAppointment,
  },
  { errorMessage: "" }
);
