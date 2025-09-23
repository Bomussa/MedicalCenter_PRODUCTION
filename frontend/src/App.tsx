import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import ExamScreen from './components/ExamScreen';
import FlowScreen from './components/FlowScreen';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AppProvider } from './context/AppContext';
import './styles.scss';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/exam" element={<ExamScreen />} />
          <Route path="/flow" element={<FlowScreen />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;


