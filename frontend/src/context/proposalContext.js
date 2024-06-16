import createDataContext from "./createDataContext";
import api from "../api/api";
import { navigate } from "../navigationRef";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  proposal: [],
  errorMessage: "",
};

const proposalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "upload_success":
      if (action.payload) {
        return {
          ...state,
          proposal: [...(state.proposal ?? []), action.payload],
        };
      } else {
        console.error("Error: action.payload is undefined");
        return state;
      }
    case "fetch_proposals":
      return action.payload;
    case "fetch_worker_proposals":
      return { ...state, proposal: action.payload };
    case "accept_bid":
      return {
        ...state,
        proposal: state.proposal.map((proposal) =>
          proposal._id === action.payload.proposal._id
            ? action.payload.proposal
            : proposal
        ),
      };

    case "reject_bid":
      return {
        ...state,
      };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "submit_report_success":
      return {
        ...state,
        proposal: [...(state.proposal ?? []), action.payload],
      };
    case "get_report_success":
      return { ...state };
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({
    type: "clear_error_message",
  });
};

const uploadProposal =
  (dispatch) =>
  async ({ image, address, area, price, bedroom, bathroom }) => {
    try {
      const authToken = await AsyncStorage.getItem("token");

      if (!image || !address || !area || !price || !bedroom || !bathroom) {
        dispatch({
          type: "add_error",
          payload: "Please provide all required information.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("profile", {
        uri: image,
        name: new Date().toISOString() + "_image",
        type: "image/*",
      });
      const cleanedArea = area.replace("sq.ft.", "").trim();
      const cleanedPrice = price.replace("Rs.", "").trim();
      formData.append("address", address);
      formData.append("area", cleanedArea);
      formData.append("price", cleanedPrice);
      formData.append("bedroom", bedroom);
      formData.append("bathroom", bathroom);

      const response = await api.post("/uploadProposal", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // console.log(response.data.proposal.image);
      dispatch({
        type: "upload_success",
        payload: response.data.proposal,
      });
      navigate("HomeScreen");
    } catch (error) {
      console.error("Error uploading proposal:", error);
      dispatch({
        type: "add_error",
        payload: "Something went wrong with the uploading proposal.",
      });
    }
  };

const fetchProposals = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");

    // console.log(authToken);
    const response = await api.get("/getProposals", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // console.log(response.data);

    dispatch({
      type: "fetch_proposals",
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with the fetching proposal.",
    });
  }
};

const fetchWorkerProposals = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const response = await api.get("/workerProposals", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // console.log(response.data);

    dispatch({
      type: "fetch_worker_proposals",
      payload: response.data.proposals,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: "add_error",
      payload: "An error occurred while fetching worker proposals.",
    });
  }
};

const submitBid =
  (dispatch) =>
  async ({ proposalId, bidPrice }) => {
    try {
      // console.log(proposalId, bidPrice);
      const authToken = await AsyncStorage.getItem("token");

      const response = await api.post(
        "/submitBid",

        { proposalId, bidPrice },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // console.log(response.data);

      // navigate("WorkerHomeScreen");
      dispatch({
        type: "fetch_proposals",
        payload: response.data,
      });
    } catch (error) {
      console.error("Error submitting bid:", error);
      dispatch({
        type: "add_error",
        payload: "Error submitting bid.",
      });
    }
  };

const acceptBid =
  (dispatch) =>
  async ({ proposalId, bidId }) => {
    try {
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/acceptBid",
        { proposalId, bidId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const acceptedBid = response.data.proposal.bids.find(
        (bid) => bid._id === bidId && bid.status === "accepted"
      );

      // console.log(acceptBid);
      if (!acceptedBid) {
        console.error("Accepted bid not found in the response.");
        dispatch({
          type: "add_error",
          payload: "Error accepting bid.",
        });
        return;
      }

      const acceptedWorkerId = acceptedBid.userId;
      // console.log(acceptedWorkerId);

      // Fetch all worker proposals for the given proposalId
      const allWorkerProposalsResponse = await api.get(
        `/workerProposals/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const allWorkerProposals =
        allWorkerProposalsResponse.data &&
        allWorkerProposalsResponse.data.proposal;

      // console.log(allWorkerProposals);
      const mainObjectId = allWorkerProposals._id;
      // console.log(mainObjectId, acceptedWorkerId);
      for (const workerProposal of Object.values(allWorkerProposals.bids)) {
        // console.log(workerProposal);
        if (workerProposal.userId !== acceptedWorkerId) {
          // console.log(workerProposal._id);
          await api.delete(`/workerProposals/${mainObjectId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }
      }
      // navigate("HomeScreen");

      dispatch({
        type: "accept_bid",
        payload: response.data,
      });
    } catch (error) {
      console.error("Error accepting bid:", error);
      dispatch({
        type: "add_error",
        payload: "Error accepting bid.",
      });
    }
  };

const rejectBid =
  (dispatch) =>
  async ({ proposalId, bidId }) => {
    try {
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/rejectBid",
        { proposalId, bidId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const bids = response.data.proposal.bids;
      // navigate("HomeScreen");

      // for (const bid of bids) {
      //   console.log(`Rejecting bid ${bid._id}`);
      // }
      // console.log(response.data);

      dispatch({
        type: "reject_bid",
        payload: response.data,
      });
    } catch (error) {
      console.error("Error rejecting bid:", error);
      dispatch({
        type: "add_error",
        payload: "Error rejecting bid.",
      });
    }
  };

const proposalBids = (dispatch) => async () => {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const response = await api.get("/proposalsWithBids", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Modify the response data to include bid amount in each bid object
    const proposalsWithBids = response.data.proposalsWithBids.map(
      (proposal) => ({
        ...proposal,
        bids: proposal.bids.map((bid) => ({
          ...bid,
          bidAmount: bid.bidAmount, // Assuming the bid amount is already included in the server response
        })),
      })
    );

    dispatch({
      type: "fetch_worker_proposals",
      payload: proposalsWithBids,
    });
  } catch (error) {
    // console.error(error);
    dispatch({
      type: "add_error",
      payload: "An error occurred while fetching worker proposals.",
    });
  }
};

const submitMonthlyReport =
  (dispatch) =>
  async ({ userId, projectId, monthlyReport, month }) => {
    try {
      // console.log(userId, projectId, monthlyReport, month);c
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.post(
        "/submit-report",
        { userId, projectId, monthlyReport, month },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // console.log(response.data.proposal);
      dispatch({
        type: "submit_report_success",
        payload: response.data.proposal,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "An error occurred while fetching worker proposals.",
      });
    }
  };

const getMonthlyReport =
  (dispatch) =>
  async ({ userId, projectId }) => {
    try {
      const authToken = await AsyncStorage.getItem("token");
      const response = await api.get(
        `/monthly-reports/${userId}/${projectId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      dispatch({
        type: "get_report_success",
        payload: response.data.monthlyReports,
      });
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "An error occurred while fetching worker proposals.",
      });
    }
  };

export const { Provider, Context } = createDataContext(
  proposalReducer,
  {
    uploadProposal,
    clearErrorMessage,
    fetchProposals,
    fetchWorkerProposals,
    submitBid,
    acceptBid,
    rejectBid,
    proposalBids,
    submitMonthlyReport,
    getMonthlyReport,
  },
  []
);
