import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exams from "./pages/Exams";
import Clinics from "./pages/Clinics";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/clinic/:id" element={<Clinics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
