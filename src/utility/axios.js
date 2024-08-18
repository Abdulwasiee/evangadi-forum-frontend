import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://evangadi-forum-backend-pypa.onrender.com",
});

export { axiosInstance };
