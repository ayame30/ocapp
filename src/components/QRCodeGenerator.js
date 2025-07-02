import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiDownload, FiRefreshCw, FiUser } from 'react-icons/fi';

const GeneratorContainer = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const GeneratorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
`;

const GeneratorTitle = styled.h2`
  color: #333;
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 300;
`;

const GeneratorSubtitle = styled.p`
  color: #666;
  margin: 0 0 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const StudentIdInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
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

const GenerateButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const QRCodeContainer = styled.div`
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRCodeCanvas = styled.canvas`
  max-width: 100%;
  height: auto;
`;

const PlaceholderText = styled.div`
  color: #999;
  font-style: italic;
`;

const DownloadButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StudentList = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const StudentListTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const StudentItem = styled.button`
  width: 100%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #e9ecef;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 500;
  color: #333;
`;

const StudentId = styled.div`
  color: #666;
  font-size: 0.85rem;
`;

// Simple QR Code generation using canvas
const generateQRCode = (text, size = 200) => {
  // This is a simplified QR code generator
  // In a real application, you'd use a proper QR code library like 'qrcode'
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = size;
  canvas.height = size;
  
  // Fill background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);
  
  // Create a simple pattern for demonstration
  // This is NOT a real QR code, just a placeholder pattern
  const moduleSize = size / 21; // 21x21 modules is typical for QR codes
  
  ctx.fillStyle = 'black';
  
  // Draw finder patterns (corners)
  const drawFinderPattern = (x, y) => {
    // Outer square
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = 'white';
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = 'black';
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };
  
  // Draw finder patterns at corners
  drawFinderPattern(0, 0);
  drawFinderPattern(14, 0);
  drawFinderPattern(0, 14);
  
  // Draw some data pattern (simplified)
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      // Skip finder pattern areas
      if ((i < 9 && j < 9) || (i < 9 && j > 11) || (i > 11 && j < 9)) continue;
      
      // Create a pattern based on the text
      const hash = text.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      if ((hash + i * j) % 3 === 0) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
      }
    }
  }
  
  // Add text below QR code
  ctx.fillStyle = 'black';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  
  return canvas;
};

const QRCodeGenerator = () => {
  const [studentId, setStudentId] = useState('');
  const [qrCodeCanvas, setQrCodeCanvas] = useState(null);
  const canvasRef = useRef(null);

  // Sample students from the seed data
  const sampleStudents = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' },
    { id: 5, name: 'David Brown' }
  ];

  const handleGenerateQR = () => {
    if (!studentId) return;
    
    // Generate QR code data as JSON
    const qrData = JSON.stringify({ id: parseInt(studentId) });
    const canvas = generateQRCode(studentId, 200);
    
    setQrCodeCanvas(canvas);
    
    // Copy canvas content to the display canvas
    if (canvasRef.current) {
      const displayCtx = canvasRef.current.getContext('2d');
      canvasRef.current.width = canvas.width;
      canvasRef.current.height = canvas.height;
      displayCtx.drawImage(canvas, 0, 0);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeCanvas) return;
    
    const link = document.createElement('a');
    link.download = `student-${studentId}-qr.png`;
    link.href = qrCodeCanvas.toDataURL();
    link.click();
  };

  const handleStudentSelect = (id) => {
    setStudentId(id.toString());
  };

  return (
    <GeneratorContainer>
      <GeneratorCard>
        <GeneratorTitle>QR Code Generator</GeneratorTitle>
        <GeneratorSubtitle>
          Generate QR codes for testing the attendance scanner
        </GeneratorSubtitle>

        <InputGroup>
          <InputLabel>Student ID</InputLabel>
          <StudentIdInput
            type="number"
            placeholder="Enter student ID (e.g., 123)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            min="1"
          />
        </InputGroup>

        <GenerateButton 
          onClick={handleGenerateQR}
          disabled={!studentId}
        >
          <FiRefreshCw />
          Generate QR Code
        </GenerateButton>

        <QRCodeContainer>
          {qrCodeCanvas ? (
            <QRCodeCanvas ref={canvasRef} />
          ) : (
            <PlaceholderText>
              Enter a student ID and click generate to create a QR code
            </PlaceholderText>
          )}
        </QRCodeContainer>

        {qrCodeCanvas && (
          <DownloadButton onClick={handleDownloadQR}>
            <FiDownload />
            Download QR Code
          </DownloadButton>
        )}

        <StudentList>
          <StudentListTitle>Quick Generate for Sample Students</StudentListTitle>
          {sampleStudents.map((student) => (
            <StudentItem 
              key={student.id}
              onClick={() => handleStudentSelect(student.id)}
            >
              <FiUser />
              <StudentInfo>
                <StudentName>{student.name}</StudentName>
                <StudentId>ID: {student.id}</StudentId>
              </StudentInfo>
            </StudentItem>
          ))}
        </StudentList>
      </GeneratorCard>
    </GeneratorContainer>
  );
};

export default QRCodeGenerator; 