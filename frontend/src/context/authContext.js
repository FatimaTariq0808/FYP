import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import api from "../api/api";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
// import { decode } from "base-64";
// import * as FileSystem from "expo-file-system";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { errorMessage: " ", errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    case "fetch_workers":
      return { ...state, worker: action.payload };
    case "user_id":
      return { ...state, userId: action.payload };
    case "user_profile":
      return action.payload;
    case "get_reviews":
      return { reviews: action.payload };
    case "delete_reviews":
      return {
        ...state,
      };
    case "block_worker_success":
      return { ...state };
    case "payment_success":
      return action.payload;
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({
    type: "clear_error_message",
  });
};

const checkConstructor = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      const response = await api.get("/checkConstructor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isConstructor = response.data;

      if (isConstructor) {
        if (response.data.constructor.role === "Admin")
          navigate("AdminHomeScreen");
        else navigate("WorkerHomeScreen");
      } else {
        navigate("HomeScreen");
      }
    } else {
      console.log("Token not found");
    }
  } catch (error) {
    console.error("Error checking constructor:", error);
  }
};

const signIn =
  (dispatch) =>
  async ({ email, password, setEmail, setPassword, emailInputRef }) => {
    try {
      const response = await api.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({
        type: "signin",
        payload: response.data.token,
      });
      await checkConstructor();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403 && data === "Worker is blocked") {
          Alert.alert(
            "Blocked",
            "You are blocked from signing in. Please contact the administrator for assistance.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Clear email and password fields
                  setEmail("");
                  setPassword("");
                  emailInputRef.current.focus();
                },
              },
            ]
          );
        } else {
          dispatch({
            type: "add_error",
            payload: "Invalid Email or Password",
          });
        }
      }
    }
  };

const signUp =
  (dispatch) =>
  async ({ username, email, password, confirmPassword, address }) => {
    try {
      const response = await api.post("/signup", {
        username,
        email,
        password,
        confirmPassword,
        address,
      });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });

      navigate("HomeScreen");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data === "Email is already in use") {
          dispatch({
            type: "add_error",
            payload: "The provided email is already in use.",
          });
        } else if (status === 422 && data === "Invalid address") {
          dispatch({
            type: "add_error",
            payload: "Invalid address.",
          });
        }
      }
    }
  };

// const base64ToArrayBuffer = (base64) => {
//   try {
//     const binaryString = decode(base64);
//     const length = binaryString.length;
//     const array = new Uint8Array(length);

//     for (let i = 0; i < length; i++) {
//       array[i] = binaryString.charCodeAt(i);
//     }

//     console.log(array);

//     return array;
//   } catch (error) {
//     console.error("Error converting Base64 to ArrayBuffer:", error);
//     throw error;
//   }
// };

// const convertUriToBuffer = async (fileUri) => {
//   try {
//     if (!fileUri) {
//       throw new Error("File URI is null or undefined.");
//     }

//     // Use FileSystem API to read the file
//     const fileInfo = await FileSystem.getInfoAsync(fileUri);
//     const { uri } = fileInfo;

//     // Read the file content
//     const fileContent = await FileSystem.readAsStringAsync(uri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     // Convert Base64-encoded content to ArrayBuffer
//     const arrayBuffer = base64ToArrayBuffer(fileContent);

//     return arrayBuffer;
//   } catch (error) {
//     console.error("Error converting file to buffer:", error);
//     throw error;
//   }
// };

const signUpConstructor =
  (dispatch) =>
  async ({
    firstname,
    lastname,
    username,
    email,
    password,
    confirmPassword,
    city,
    address,
    uploadedDocument,
    role,
  }) => {
    try {
      const response = await api.post("/signup", {
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
        city,
        address,
        uploadedDocument,
        role,
      });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      navigate("WorkerHomeScreen");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data === "Email is already in use") {
          dispatch({
            type: "add_error",
            payload: "The provided email is already in use.",
          });
        } else if (status === 422 && data === "Invalid address") {
          dispatch({
            type: "add_error",
            payload: "Invalid address.",
          });
        } else if (status === 400 && data.error === "Invalid city") {
          dispatch({
            type: "add_error",
            payload: "Invalid city.",
          });
        }
      }
    }
  };

const signOut = (dispatch) => async () => {
  try {
    await AsyncStorage.removeItem("token");
    dispatch({
      type: "signout",
    });
    navigate("SignIn");
  } catch (err) {
    console.error("Error while signing out:", err);
  }
};

const fetchWorkers = (dispatch) => async () => {
  try {
    const response = await api.get("/getWorkers");
    // console.log(response.data);

    dispatch({
      type: "fetch_workers",
      payload: response.data,
    });
    // console.log(response.data);
  } catch (error) {
    console.error(error);
    dispatch({
      type: "add_error",
      payload: "An error occurred while fetching worker proposals.",
    });
  }
};

const getUserId = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const response = await api.get("/currentUser", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    userId = response.data.userId;
    dispatch({
      type: "user_id",
      payload: response.data.userId,
    });
    return userId;
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Error getting user.",
    });
  }
};

const userProfile = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const response = await api.get("/userProfile", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // console.log(response.data);
    dispatch({
      type: "user_profile",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Error getting user.",
    });
  }
};

const workerProfile =
  (dispatch) =>
  async ({ id }) => {
    try {
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.get(`/userProfile/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // console.log(response.data);
      dispatch({
        type: "user_profile",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const createReviews =
  (dispatch) =>
  async ({ rating, comment, workerId }) => {
    try {
      // console.log(rating, comment, workerId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.put(
        "/createReviews",
        { rating, comment, workerId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // console.log(response.data);
      navigate("HomeScreen");
      dispatch({
        type: "user_profile",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const getReviews =
  (dispatch) =>
  async ({ workerId }) => {
    try {
      // console.log(workerId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.get(`/getReviews/${workerId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // console.log(response.data);
      // navigate("HomeScreen");
      dispatch({
        type: "get_reviews",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const deleteReview =
  (dispatch) =>
  async ({ reviewId }) => {
    try {
      // console.log("Review", reviewId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.delete(`/deleteReviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // console.log(response.data);
      // navigate("HomeScreen");
      dispatch({
        type: "delete_reviews",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const blockWorker =
  (dispatch) =>
  async ({ id }) => {
    try {
      // console.log( id);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.put(`/contractors/${id}/block`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // console.log(response.data);
      // navigate("HomeScreen");
      dispatch({
        type: "block_worker_success",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const unblockWorker =
  (dispatch) =>
  async ({ id }) => {
    try {
      // console.log( id);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.put(`/contractors/${id}/unblock`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // console.log(response.data);
      // navigate("HomeScreen");
      dispatch({
        type: "block_worker_success",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };

const processPayment =
  (dispatch) =>
  async ({ amount, workerId }) => {
    try {
      // console.log(amount, workerId);
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/payment",
        { amount, workerId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // console.log("response", response.data);
      dispatch({
        type: "payment_success",
        payload: response.data,
      });
      navigate("HomeScreen");
    } catch {
      dispatch({
        type: "add_error",
        payload: "Error getting user.",
      });
    }
  };
export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signIn,
    clearErrorMessage,
    signUp,
    signUpConstructor,
    signOut,
    fetchWorkers,
    getUserId,
    userProfile,
    createReviews,
    getReviews,
    deleteReview,
    workerProfile,
    blockWorker,
    unblockWorker,
    processPayment,
  },
  { token: null, errorMessage: "" }
);
