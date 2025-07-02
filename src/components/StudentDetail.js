import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { 
  FiUser, 
  FiPhone, 
  FiMessageSquare, 
  FiCalendar, 
  FiClock, 
  FiEdit, 
  FiSave, 
  FiX, 
  FiArrowLeft, 
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { API_URL } from '../constants';

const StudentDetailContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-3px);
  }
`;

const StudentInfoCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const StudentHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const StudentAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 1rem;
`;

const StudentName = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  font-weight: 300;
`;

const StudentId = styled.div`
  opacity: 0.9;
  font-size: 1rem;
`;

const StudentBody = styled.div`
  padding: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const InfoIcon = styled.div`
  color: #667eea;
  font-size: 1.2rem;
  margin-top: 0.1rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

const InfoValue = styled.div`
  color: #333;
  font-size: 1rem;
  word-break: break-word;
`;

const RemarksSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
`;

const RemarksHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1rem;
`;

const RemarksTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const EditButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const RemarksContent = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.2rem;
  color: #333;
  line-height: 1.6;
  min-height: 80px;
  
  ${props => !props.hasRemarks && `
    color: #adb5bd;
    font-style: italic;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const RemarksEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RemarksTextarea = styled.textarea`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.2rem;
  color: #333;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
  }
`;

const RemarksActions = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AttendanceCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

const AttendanceHeader = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: between;
`;

const AttendanceTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AttendanceList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const AttendanceItem = styled.div`
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AttendanceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e8f5e8;
  color: #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

const AttendanceInfo = styled.div`
  flex: 1;
`;

const AttendanceDate = styled.div`
  color: #333;
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const AttendanceTime = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const LoadingContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 3rem;
  text-align: center;
  color: #666;
`;

const ErrorContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border-left: 5px solid #dc3545;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin: 0;
  font-size: 1rem;
`;

const EmptyAttendance = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #666;
`;

const StudentDetail = ({ token }) => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingRemarks, setEditingRemarks] = useState(false);
  const [remarksValue, setRemarksValue] = useState('');
  const [savingRemarks, setSavingRemarks] = useState(false);


  const fetchStudentInfo = async () => {
    try {
      setLoading(true);
      setError('');


      const response = await axios.get(`${API_URL}/student/${studentId}`);
      setStudent(response.data);
      setRemarksValue(response.data.remarks || '');
    } catch (error) {
      console.error('Failed to fetch student:', error);
      setError('Failed to load student information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setAttendanceLoading(true);

      
      const response = await axios.get(`${API_URL}/attendance/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      // Don't set error for attendance - it's not critical
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentInfo();
      if (token) {
        fetchAttendance();
      }
    }
  }, [studentId, token]);

  const handleSaveRemarks = async () => {
    try {
      setSavingRemarks(true);

      const response = await axios.put(
        `${API_URL}/student/${studentId}`,
        { remarks: remarksValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setStudent(response.data);
      setEditingRemarks(false);
    } catch (error) {
      console.error('Failed to save remarks:', error);
      // You could show an error message here
    } finally {
      setSavingRemarks(false);
    }
  };

  const handleCancelEdit = () => {
    setRemarksValue(student?.remarks || '');
    setEditingRemarks(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStudentInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <StudentDetailContainer>
        <BackButton onClick={() => navigate('/students')}>
          <FiArrowLeft />
          Back to Students
        </BackButton>
        <LoadingContainer>
          <FiRefreshCw style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <div>Loading student information...</div>
        </LoadingContainer>
      </StudentDetailContainer>
    );
  }

  if (error) {
    return (
      <StudentDetailContainer>
        <BackButton onClick={() => navigate('/students')}>
          <FiArrowLeft />
          Back to Students
        </BackButton>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      </StudentDetailContainer>
    );
  }

  if (!student) {
    return (
      <StudentDetailContainer>
        <BackButton onClick={() => navigate('/students')}>
          <FiArrowLeft />
          Back to Students
        </BackButton>
        <ErrorContainer>
          <ErrorMessage>Student not found</ErrorMessage>
        </ErrorContainer>
      </StudentDetailContainer>
    );
  }

  return (
    <StudentDetailContainer>
      <BackButton onClick={() => navigate('/students')}>
        <FiArrowLeft />
        Back to Students
      </BackButton>

      <StudentInfoCard>
        <StudentHeader>
          <StudentAvatar>
            {getStudentInitial(student.name)}
          </StudentAvatar>
          <StudentName>{student.name}</StudentName>
          <StudentId>Student ID: {student.id}</StudentId>
        </StudentHeader>

        <StudentBody>
          <InfoGrid>
            <InfoItem>
              <InfoIcon><FiPhone /></InfoIcon>
              <InfoContent>
                <InfoLabel>Phone Number</InfoLabel>
                <InfoValue>{student.tel || 'Not provided'}</InfoValue>
              </InfoContent>
            </InfoItem>
            <InfoItem>
              <InfoIcon><FiCalendar /></InfoIcon>
              <InfoContent>
                <InfoLabel>Registered</InfoLabel>
                <InfoValue>{formatDate(student.created_at)}</InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>

          <RemarksSection>
            <RemarksHeader>
              <RemarksTitle>
                <FiMessageSquare />
                Remarks
              </RemarksTitle>
              {!editingRemarks && token && (
                <EditButton onClick={() => setEditingRemarks(true)}>
                  <FiEdit />
                  Edit
                </EditButton>
              )}
            </RemarksHeader>

            {editingRemarks ? (
              <RemarksEditContainer>
                <RemarksTextarea
                  value={remarksValue}
                  onChange={(e) => setRemarksValue(e.target.value)}
                  placeholder="Enter remarks about this student..."
                />
                <RemarksActions>
                  <ActionButton onClick={handleCancelEdit} disabled={savingRemarks}>
                    <FiX />
                    Cancel
                  </ActionButton>
                  <ActionButton primary onClick={handleSaveRemarks} disabled={savingRemarks}>
                    <FiSave />
                    {savingRemarks ? 'Saving...' : 'Save'}
                  </ActionButton>
                </RemarksActions>
              </RemarksEditContainer>
            ) : (
              <RemarksContent hasRemarks={!!student.remarks}>
                {student.remarks || 'No remarks added yet'}
              </RemarksContent>
            )}
          </RemarksSection>
        </StudentBody>
      </StudentInfoCard>

      {token && (
        <AttendanceCard>
          <AttendanceHeader>
            <AttendanceTitle>
              <FiCheckCircle />
              Attendance History
            </AttendanceTitle>
            <RefreshButton onClick={fetchAttendance} disabled={attendanceLoading}>
              <FiRefreshCw />
              Refresh
            </RefreshButton>
          </AttendanceHeader>

          <AttendanceList>
            {attendanceLoading ? (
              <LoadingContainer>
                <FiRefreshCw style={{ fontSize: '1.5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                <div>Loading attendance records...</div>
              </LoadingContainer>
            ) : attendance.length === 0 ? (
              <EmptyAttendance>
                <FiAlertCircle style={{ fontSize: '2rem', marginBottom: '1rem', color: '#adb5bd' }} />
                <div>No attendance records found</div>
              </EmptyAttendance>
            ) : (
              attendance.map((record) => (
                <AttendanceItem key={record.id}>
                  <AttendanceIcon>
                    <FiCheckCircle />
                  </AttendanceIcon>
                  <AttendanceInfo>
                    <AttendanceDate>{formatDate(record.time)}</AttendanceDate>
                    <AttendanceTime>
                      <FiClock style={{ marginRight: '0.3rem' }} />
                      {formatTime(record.time)}
                    </AttendanceTime>
                  </AttendanceInfo>
                </AttendanceItem>
              ))
            )}
          </AttendanceList>
        </AttendanceCard>
      )}
    </StudentDetailContainer>
  );
};

export default StudentDetail; 