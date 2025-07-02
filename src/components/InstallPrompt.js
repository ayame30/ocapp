import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiDownload, FiX, FiSmartphone } from 'react-icons/fi';

const InstallBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  transform: translateY(${props => props.show ? '0' : '100%'});
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const InstallIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const InstallContent = styled.div`
  flex: 1;
`;

const InstallTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.2rem;
  font-size: 0.95rem;
`;

const InstallSubtitle = styled.div`
  opacity: 0.9;
  font-size: 0.8rem;
  line-height: 1.3;
`;

const InstallActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const InstallButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
`;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show immediately, wait a bit for user to explore
      setTimeout(() => {
        setShowBanner(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowBanner(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed, dismissed, or no prompt available
  if (isInstalled || !deferredPrompt || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <InstallBanner show={showBanner}>
      <InstallIcon>
        <FiSmartphone />
      </InstallIcon>
      
      <InstallContent>
        <InstallTitle>Install Staff Attendance</InstallTitle>
        <InstallSubtitle>
          Add to home screen for quick access and full-screen experience
        </InstallSubtitle>
      </InstallContent>
      
      <InstallActions>
        <InstallButton onClick={handleInstallClick}>
          <FiDownload />
          Install
        </InstallButton>
        
        <CloseButton onClick={handleDismiss}>
          <FiX />
        </CloseButton>
      </InstallActions>
    </InstallBanner>
  );
};

export default InstallPrompt; 