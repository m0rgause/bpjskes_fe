import axios from "axios";
import { notification } from "antd";
import dayjs from "dayjs";

const api_public = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  maxBodyLength: Infinity,
});


async function get(url, params, token = null) {
  try {
    token = localStorage.getItem("session") ? JSON.parse(localStorage.getItem("session")).token : token;
    const response = await axios.get(
      process.env.REACT_APP_API_URL + url,
      {
        params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function getPublic(url, params) {
  try {
    const response = await api_public.get(url, { params });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function post(url, data, token = null) {
  try {
    token = localStorage.getItem("session") ? JSON.parse(localStorage.getItem("session")).token : token;
    const response = await axios.post(process.env.REACT_APP_API_URL + url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function postPublic(url, data) {
  try {
    const response = await api_public.post(url, data);
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function put(url, data, token = null) {
  try {
    token = localStorage.getItem("session") ? JSON.parse(localStorage.getItem("session")).token : token;
    const response = await axios.put(process.env.REACT_APP_API_URL + url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function del(url, data, token = null) {
  try {
    token = localStorage.getItem("session") ? JSON.parse(localStorage.getItem("session")).token : token;
    const response = await axios.delete(process.env.REACT_APP_API_URL + url, {
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

function handleRequestError(error) {
  // You can add your error handling logic here, e.g., logging errors, displaying messages
  notification.error({
    message: "Terjadi kesalahan",
    placement: "top",
    duration: 2,
  });
  console.error("Request Error:", error.response.data);
}
function getFilterDate() {
  let filterDate = {
    startDate: dayjs(),
    endDate: dayjs(),
  };
  return filterDate;
}

export { get, getPublic, post, postPublic, put, del, getFilterDate};
