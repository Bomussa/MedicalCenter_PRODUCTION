import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.scss";
import "./styles/cms.css";
import "./i18n"; // Import i18n configuration
import { AppProvider } from "./context/AppContext";
import StartScreen from "./components/StartScreen";
import ExamScreen from "./components/ExamScreen";
import FlowScreen from "./components/FlowScreen";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import RecordsManager from "./components/RecordsManager";
import Reports from "./components/Reports";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/exam" element={<ExamScreen />} />
          <Route path="/flow" element={<FlowScreen />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/records" element={<RecordsManager />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);


