import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { API_URL } from '../constants';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const LoginTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 300;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #333;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;


const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        password: password
      });

      if (response.data.access_token) {
        onLogin(response.data.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Staff Login</LoginTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <PasswordInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputGroup>

          <LoginButton type="submit" disabled={loading || !password}>
            {loading && <LoadingSpinner />}
            {loading ? 'Logging in...' : 'Login'}
          </LoginButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 