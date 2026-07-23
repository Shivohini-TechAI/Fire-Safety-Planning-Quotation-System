import axios from "axios";

// Suhas's deployed backend — separate service from the main auth/projects backend,
// and it has no authentication at all, so this client is intentionally simple.
const quotationApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUOTATION_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default quotationApi;