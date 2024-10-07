import { config } from "@/config";
import axios from "axios";

export const uploadFile = async (file: any) => {
  if (!file) {
    return { message: "Invalid Credentials", type: "error", data: null };
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apiKey", config.kf_public_api_key);
  try {
    const response = await axios.post(
      "https://files-public.coffeecodes.in/upload",
      formData,
    );
    const url = response.data.url;
    return { message: "File uploaded!", type: "success", data: url.toString() };
  } catch (e) {
    console.log(e);
    return { message: "Invalid Credentials", type: "error", data: "" };
  }
};
