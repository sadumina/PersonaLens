import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzeCV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/analyze/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
