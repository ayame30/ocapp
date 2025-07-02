import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { FiCamera, FiRefreshCw, FiCheck, FiX, FiShield, FiAlertCircle, FiUpload, FiImage } from 'react-icons/fi';
import { API_URL } from '../constants';

const ScannerContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

const ScannerCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const ScannerHeader = styled.div`
  padding: 2rem 2rem 1rem;
  text-align: center;
`;

const ScannerTitle = styled.h2`
  color: #333;
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 300;
`;

const ScannerSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const ScanModeToggle = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.3rem;
  margin: 1rem 2rem;
  gap: 0.3rem;
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => props.active ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  ` : `
    background: transparent;
    color: #666;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
  `}
`;

const PermissionPrompt = styled.div`
  padding: 2rem;
  text-align: center;
`;

const PermissionIcon = styled.div`
  background: ${props => props.denied ? '#fee' : '#e3f2fd'};
  color: ${props => props.denied ? '#c33' : '#1565c0'};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
  border: 3px solid ${props => props.denied ? '#fcc' : '#bbdefb'};
`;

const PermissionTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: 500;
`;

const PermissionText = styled.p`
  color: #666;
  margin: 0 0 2rem;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const PermissionSteps = styled.ol`
  text-align: left;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 1rem 0 2rem;
  padding-left: 1.5rem;
`;

const PermissionStep = styled.li`
  margin-bottom: 0.5rem;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 15px;
  margin: 0 2rem 2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 3px solid #667eea;
  border-radius: 15px;
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 3px solid rgba(102, 126, 234, 0.3);
    border-radius: 15px;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
  }
`;

const UploadDropZone = styled.div`
  width: 100%;
  height: 100%;
  border: 3px dashed #667eea;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.dragOver ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(102, 126, 234, 0.05);
    border-color: #5a6fd8;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ControlsContainer = styled.div`
  padding: 0 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  ` : props.secondary ? `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e9ecef;
    
    &:hover {
      background: #e9ecef;
    }
  ` : `
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    
    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div`
  margin: 1rem 2rem;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.type === 'success' ? `
    background: #e8f5e8;
    color: #2d5f2d;
    border: 1px solid #c3e6c3;
  ` : props.type === 'error' ? `
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
  ` : `
    background: #e3f2fd;
    color: #1565c0;
    border: 1px solid #bbdefb;
  `}
`;

const QRScanner = ({ token }) => {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied', 'checking'
  const [scanning, setScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const qrScannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scanMode === 'camera') {
      checkCameraPermission();
    } else {
      setPermissionState('granted'); // No permission needed for upload mode
    }
    
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, [scanMode]);

  const checkCameraPermission = async () => {
    try {
      setPermissionState('checking');
      
      // Check if Permissions API is supported
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        setPermissionState(permission.state);
        
        // Listen for permission changes
        permission.onchange = () => {
          setPermissionState(permission.state);
        };
      } else {
        // Fallback for browsers without Permissions API
        setPermissionState('prompt');
      }
    } catch (error) {
      console.log('Permission check failed:', error);
      setPermissionState('prompt');
    }
  };

  const requestCameraPermission = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer rear camera
        } 
      });
      
      // Permission granted, stop the test stream
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      showMessage('Camera permission granted! You can now start scanning.', 'success');
      
    } catch (error) {
      console.error('Camera permission denied:', error);
      setPermissionState('denied');
      showMessage('Camera access denied. Please enable camera permissions to scan QR codes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const startScanning = async () => {
    try {
      setLoading(true);
      
      // Double-check permission before starting
      if (permissionState !== 'granted') {
        await requestCameraPermission();
        if (permissionState !== 'granted') {
          return;
        }
      }
      
      // Stop any existing scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }

      // Create new scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          onDecodeError: (error) => {
            // Silently ignore decode errors during scanning
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      await qrScannerRef.current.start();
      setScanning(true);
      showMessage('Camera started. Point at a QR code to scan.', 'info');
    } catch (error) {
      console.error('Failed to start camera:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionState('denied');
        showMessage('Camera permission denied. Please enable camera access in your browser settings.', 'error');
      } else {
        showMessage('Failed to access camera. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      setScanning(false);
      showMessage('Scanner stopped.', 'info');
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setMessage('');

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file.', 'error');
        return;
      }

      // Create URL for image display
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Scan QR code from uploaded image
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      });

      if (result && result.data) {
        showMessage('QR code detected in image!', 'success');
        handleScanResult(result.data);
      } else {
        showMessage('No QR code found in the image. Please try another image.', 'error');
      }

    } catch (error) {
      console.error('Failed to scan image:', error);
      showMessage('Failed to scan image. Please try another image or ensure it contains a clear QR code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleScanResult = async (data) => {
    try {
      // Extract student ID from QR code data
      let studentId;
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(data);
        studentId = parsed.id || parsed.studentId || parsed.student_id;
      } catch {
        // If not JSON, try to extract number from string
        const match = data.match(/\d+/);
        studentId = match ? parseInt(match[0]) : null;
      }

      if (!studentId) {
        showMessage('Invalid QR code format. Could not extract student ID.', 'error');
        return;
      }

      // Stop scanning during API call
      if (scanning) {
        stopScanning();
      }
      setLoading(true);

      // Send attendance record
      const response = await axios.post(
        `${API_URL}/attendance/${studentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showMessage(`Attendance recorded successfully for student ${studentId}!`, 'success');
      
      // Navigate to attendance view after a short delay
      setTimeout(() => {
        navigate(`/attendance/${studentId}`);
      }, 2000);

    } catch (error) {
      console.error('Attendance recording failed:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to record attendance';
      showMessage(errorMessage, 'error');
      
      // Restart scanning after error (only if in camera mode)
      if (scanMode === 'camera') {
        setTimeout(() => {
          startScanning();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPermissionPrompt = () => {
    if (permissionState === 'checking') {
      return (
        <PermissionPrompt>
          <PermissionIcon>
            <FiRefreshCw />
          </PermissionIcon>
          <PermissionTitle>Checking Camera Permission</PermissionTitle>
          <PermissionText>Please wait while we check camera access...</PermissionText>
        </PermissionPrompt>
      );
    }

    if (permissionState === 'denied') {
      return (
        <PermissionPrompt>
          <PermissionIcon denied>
            <FiAlertCircle />
          </PermissionIcon>
          <PermissionTitle>Camera Access Denied</PermissionTitle>
          <PermissionText>
            To scan QR codes with camera, please enable camera permissions in your browser:
          </PermissionText>
          <PermissionSteps>
            <PermissionStep>Click the camera icon in your browser's address bar</PermissionStep>
            <PermissionStep>Select "Allow" for camera access</PermissionStep>
            <PermissionStep>Refresh this page and try again</PermissionStep>
          </PermissionSteps>
          <ControlsContainer>
            <ControlButton secondary onClick={() => window.location.reload()}>
              <FiRefreshCw />
              Refresh Page
            </ControlButton>
            <ControlButton onClick={requestCameraPermission} disabled={loading}>
              <FiCamera />
              Try Again
            </ControlButton>
          </ControlsContainer>
        </PermissionPrompt>
      );
    }

    if (permissionState === 'prompt') {
      return (
        <PermissionPrompt>
          <PermissionIcon>
            <FiShield />
          </PermissionIcon>
          <PermissionTitle>Camera Permission Required</PermissionTitle>
          <PermissionText>
            To scan QR codes with camera, we need access to your device's camera. 
            Your privacy is important - the camera is only used for QR code scanning and no images are stored.
          </PermissionText>
          <ControlsContainer>
            <ControlButton primary onClick={requestCameraPermission} disabled={loading}>
              <FiCamera />
              {loading ? 'Requesting Permission...' : 'Grant Camera Access'}
            </ControlButton>
          </ControlsContainer>
        </PermissionPrompt>
      );
    }

    return null;
  };

  const renderScannerContent = () => {
    if (scanMode === 'camera') {
      if (permissionState !== 'granted') {
        return renderPermissionPrompt();
      }

      return (
        <>
          <VideoContainer>
            {scanning ? (
              <>
                <Video ref={videoRef} autoPlay playsInline />
                <ScannerOverlay />
              </>
            ) : (
              <PlaceholderIcon>
                <FiCamera />
              </PlaceholderIcon>
            )}
          </VideoContainer>

          <ControlsContainer>
            {!scanning ? (
              <ControlButton primary onClick={startScanning} disabled={loading}>
                {loading ? <FiRefreshCw /> : <FiCamera />}
                {loading ? 'Starting...' : 'Start Scanner'}
              </ControlButton>
            ) : (
              <ControlButton onClick={stopScanning}>
                <FiX />
                Stop Scanner
              </ControlButton>
            )}
          </ControlsContainer>
        </>
      );
    }

    // Upload mode
    return (
      <>
        <VideoContainer>
          {uploadedImage ? (
            <UploadedImage src={uploadedImage} alt="Uploaded QR code" />
          ) : (
            <UploadDropZone
              dragOver={dragOver}
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon>
                <FiUpload />
              </UploadIcon>
              <UploadText>
                Drop an image here or click to select<br />
                <small>Supports JPG, PNG, GIF formats</small>
              </UploadText>
            </UploadDropZone>
          )}
        </VideoContainer>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />

        <ControlsContainer>
          <ControlButton primary onClick={() => fileInputRef.current?.click()} disabled={loading}>
            <FiUpload />
            {loading ? 'Processing...' : 'Select Image'}
          </ControlButton>
          {uploadedImage && (
            <ControlButton onClick={clearUploadedImage}>
              <FiX />
              Clear Image
            </ControlButton>
          )}
        </ControlsContainer>
      </>
    );
  };

  return (
    <ScannerContainer>
      <ScannerCard>
        <ScannerHeader>
          <ScannerTitle>QR Code Scanner</ScannerTitle>
          <ScannerSubtitle>
            Scan student QR codes to record attendance
          </ScannerSubtitle>
        </ScannerHeader>

        <ScanModeToggle>
          <ModeButton 
            active={scanMode === 'camera'} 
            onClick={() => setScanMode('camera')}
          >
            <FiCamera />
            Camera
          </ModeButton>
          <ModeButton 
            active={scanMode === 'upload'} 
            onClick={() => setScanMode('upload')}
          >
            <FiImage />
            Upload
          </ModeButton>
        </ScanModeToggle>

        {renderScannerContent()}

        {message && (
          <StatusMessage type={messageType}>
            {messageType === 'success' && <FiCheck />}
            {messageType === 'error' && <FiX />}
            {messageType === 'info' && <FiCamera />}
            {message}
          </StatusMessage>
        )}
      </ScannerCard>
    </ScannerContainer>
  );
};

export default QRScanner; 