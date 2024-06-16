import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export default axios.create({
//   baseURL: "https://0a6e-2400-adc5-149-6200-f18e-23d1-f243-d89b.ngrok-free.app",
// });

const instance = axios.create({
  baseURL: "https://1f82-223-123-9-79.ngrok-free.app",
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
