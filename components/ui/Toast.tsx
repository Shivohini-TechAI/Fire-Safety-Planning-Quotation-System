"use client";
import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#0d1730",
          color: "#e8e4f0",
          border: "1px solid #16294e",
          borderRadius: "10px",
          fontSize: "13px",
          fontFamily: "inherit",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#0d1730" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#0d1730" },
        },
      }}
    />
  );
}
