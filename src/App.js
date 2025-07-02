import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import AttendanceView from './components/AttendanceView';
import QRCodeGenerator from './components/QRCodeGenerator';
import Students from './components/Students';
import StudentDetail from './components/StudentDetail';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
`;

const HeaderActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const NavButton = styled.button`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-weight: ${props => props.$active ? '600' : '400'};

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// Main App Content Component (needs to be inside Router to use navigate)
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (authToken) => {
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', authToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Header>
        <Title>OC</Title>
        {isAuthenticated && (
          <HeaderActions>
            <NavButton 
              onClick={() => handleNavigation('/students')}
              $active={location.pathname === '/students' || location.pathname.startsWith('/student/')}
            >
              Students
            </NavButton>
            <NavButton 
              onClick={() => handleNavigation('/scanner')}
              $active={location.pathname === '/scanner'}
            >
              Scanner
            </NavButton>
            <NavButton onClick={() => handleNavigation('/generator')}>
              Test QR
            </NavButton>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </HeaderActions>
        )}
      </Header>

      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/students" replace />
            )
          } 
        />
        <Route 
          path="/scanner" 
          element={
            isAuthenticated ? (
              <QRScanner token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/attendance/:studentId" 
          element={
            isAuthenticated ? (
              <AttendanceView token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/students" 
          element={
            isAuthenticated ? (
              <Students />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/student/:studentId" 
          element={
            isAuthenticated ? (
              <StudentDetail token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/generator" 
          element={<QRCodeGenerator />} 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/students" : "/login"} replace />
          } 
        />
      </Routes>
      
      {/* Show install prompt when appropriate */}
      <InstallPrompt />
    </>
  );
}

function App() {
  return (
    <AppContainer>
      <Router>
        <AppContent />
      </Router>
    </AppContainer>
  );
}

export default App; 