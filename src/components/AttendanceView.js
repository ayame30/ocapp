import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FiArrowLeft, FiEdit2, FiSave, FiX, FiUser, FiClock, FiCalendar } from 'react-icons/fi';
import { API_URL } from '../constants';

const AttendanceContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const HeaderTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 300;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const StudentInfo = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #eee;
`;

const StudentName = styled.h2`
  color: #333;
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StudentDetail = styled.p`
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const RemarksSection = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
`;

const RemarksHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RemarksTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  flex: 1;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const RemarksText = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-style: ${props => props.empty ? 'italic' : 'normal'};
  color: ${props => props.empty ? '#999' : '#666'};
`;

const RemarksTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.8rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const RemarksActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  ${props => props.primary ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e9e9e9;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AttendanceList = styled.div`
  padding: 2rem;
`;

const AttendanceTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AttendanceRecord = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  border-left: 4px solid #667eea;
`;

const AttendanceIcon = styled.div`
  background: #667eea;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

const AttendanceInfo = styled.div`
  flex: 1;
`;

const AttendanceDate = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.2rem;
`;

const AttendanceTime = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: 1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
`;


const AttendanceView = ({ token }) => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRemarks, setEditingRemarks] = useState(false);
  const [remarksValue, setRemarksValue] = useState('');
  const [savingRemarks, setSavingRemarks] = useState(false);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch student data and attendance records in parallel
      const [studentResponse, attendanceResponse] = await Promise.all([
        axios.get(`${API_URL}/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/attendance/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const studentData = studentResponse.data;

      setStudent(studentData);
      setRemarksValue(studentData.remarks || '');
      setAttendanceRecords(attendanceResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRemarks = async () => {
    try {
      setSavingRemarks(true);
      await axios.put(
        `${API_URL}/student/${studentId}`,
        { remarks: remarksValue },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStudent(prev => ({ ...prev, remarks: remarksValue }));
      setEditingRemarks(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update remarks');
    } finally {
      setSavingRemarks(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (loading) {
    return (
      <AttendanceContainer>
        <LoadingSpinner>Loading attendance data...</LoadingSpinner>
      </AttendanceContainer>
    );
  }

  return (
    <AttendanceContainer>
      <Header>
        <BackButton onClick={() => navigate('/scanner')}>
          <FiArrowLeft />
        </BackButton>
        <HeaderTitle>Student Attendance</HeaderTitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {student && (
        <>
          <Card>
            <StudentInfo>
              <StudentName>
                <FiUser />
                {student.name}
              </StudentName>
              <StudentDetail>ID: {student.id}</StudentDetail>
              <StudentDetail>Tel: {student.tel || 'Not provided'}</StudentDetail>
            </StudentInfo>

            <RemarksSection>
              <RemarksHeader>
                <RemarksTitle>Remarks</RemarksTitle>
                {!editingRemarks && (
                  <EditButton onClick={() => setEditingRemarks(true)}>
                    <FiEdit2 />
                    Edit
                  </EditButton>
                )}
              </RemarksHeader>

              {editingRemarks ? (
                <>
                  <RemarksTextarea
                    value={remarksValue}
                    onChange={(e) => setRemarksValue(e.target.value)}
                    placeholder="Enter remarks for this student..."
                  />
                  <RemarksActions>
                    <ActionButton
                      primary
                      onClick={handleSaveRemarks}
                      disabled={savingRemarks}
                    >
                      <FiSave />
                      {savingRemarks ? 'Saving...' : 'Save'}
                    </ActionButton>
                    <ActionButton onClick={() => {
                      setEditingRemarks(false);
                      setRemarksValue(student.remarks || '');
                    }}>
                      <FiX />
                      Cancel
                    </ActionButton>
                  </RemarksActions>
                </>
              ) : (
                <RemarksText empty={!student.remarks}>
                  {student.remarks || 'No remarks added yet.'}
                </RemarksText>
              )}
            </RemarksSection>

            <AttendanceList>
              <AttendanceTitle>
                <FiCalendar />
                Attendance Records
              </AttendanceTitle>

              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => {
                  const { date, time } = formatDateTime(record.time);
                  return (
                    <AttendanceRecord key={record.id}>
                      <AttendanceIcon>
                        <FiClock />
                      </AttendanceIcon>
                      <AttendanceInfo>
                        <AttendanceDate>{date}</AttendanceDate>
                        <AttendanceTime>{time}</AttendanceTime>
                      </AttendanceInfo>
                    </AttendanceRecord>
                  );
                })
              ) : (
                <EmptyState>No attendance records found.</EmptyState>
              )}
            </AttendanceList>
          </Card>
        </>
      )}
    </AttendanceContainer>
  );
};

export default AttendanceView; 