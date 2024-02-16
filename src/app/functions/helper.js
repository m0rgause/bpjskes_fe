import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // Authorization: `Basic ${process.env.REACT_APP_BASIC_AUTH}`,
  },
  maxBodyLength: Infinity,
});

async function get(url, params) {
  try {
    const response = await api.get(url, { params });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function post(url, data) {
  try {
    const response = await api.post(url, data);
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function put(url, data) {
  try {
    const response = await api.put(url, data);
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function del(url, data) {
  try {
    const response = await api.delete(url, { data });
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

function handleRequestError(error) {
  // You can add your error handling logic here, e.g., logging errors, displaying messages
  console.error("Request Error:", error.response.data);
}

export { get, post, put, del };
