import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FiUser, FiPhone, FiMessageSquare, FiRefreshCw, FiChevronRight, FiUsers, FiSearch } from 'react-icons/fi';
import { API_URL } from '../constants';

const StudentsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StudentsHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StudentsTitle = styled.h2`
  color: #333;
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StudentsSubtitle = styled.p`
  color: #666;
  margin: 0 0 1.5rem;
  font-size: 1rem;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-size: 1.1rem;
`;

const RefreshButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

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

const StudentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StudentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const StudentHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const StudentAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StudentDetails = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  color: #333;
  margin: 0 0 0.3rem;
  font-size: 1.2rem;
  font-weight: 500;
`;

const StudentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StudentMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const StudentRemarks = styled.div`
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChevronIcon = styled.div`
  color: #adb5bd;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  ${StudentCard}:hover & {
    color: #667eea;
    transform: translateX(3px);
  }
`;

const LoadingContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 3rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  border-left: 5px solid #dc3545;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin: 0;
  font-size: 1rem;
`;

const EmptyState = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 3rem;
  text-align: center;
  color: #666;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
`;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.tel && student.tel.includes(searchTerm)) ||
        (student.remarks && student.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const getStudentInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const formatPhone = (phone) => {
    if (!phone) return 'No phone';
    return phone;
  };

  if (loading) {
    return (
      <StudentsContainer>
        <StudentsHeader>
          <StudentsTitle>
            <FiUsers />
            Students Directory
          </StudentsTitle>
          <StudentsSubtitle>Loading student information...</StudentsSubtitle>
        </StudentsHeader>
        <LoadingContainer>
          <FiRefreshCw style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <div>Loading students...</div>
        </LoadingContainer>
      </StudentsContainer>
    );
  }

  if (error) {
    return (
      <StudentsContainer>
        <StudentsHeader>
          <StudentsTitle>
            <FiUsers />
            Students Directory
          </StudentsTitle>
          <StudentsSubtitle>View and manage all students</StudentsSubtitle>
          <ControlsRow>
            <RefreshButton onClick={fetchStudents}>
              <FiRefreshCw />
              Try Again
            </RefreshButton>
          </ControlsRow>
        </StudentsHeader>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      </StudentsContainer>
    );
  }

  return (
    <StudentsContainer>
      <StudentsHeader>
        <StudentsTitle>
          <FiUsers />
          Students Directory
        </StudentsTitle>
        <StudentsSubtitle>
          {students.length} student{students.length !== 1 ? 's' : ''} registered
        </StudentsSubtitle>
        <ControlsRow>
          <SearchContainer>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <RefreshButton onClick={fetchStudents} disabled={loading}>
            <FiRefreshCw />
            Refresh
          </RefreshButton>
        </ControlsRow>
      </StudentsHeader>

      {filteredStudents.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FiUsers />
          </EmptyStateIcon>
          <h3>No students found</h3>
          <p>
            {searchTerm.trim() 
              ? `No students match "${searchTerm}". Try a different search term.`
              : 'No students are registered in the system yet.'
            }
          </p>
        </EmptyState>
      ) : (
        <StudentsList>
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              onClick={() => handleStudentClick(student.id)}
            >
              <StudentHeader>
                <StudentInfo>
                  <StudentAvatar>
                    {getStudentInitial(student.name)}
                  </StudentAvatar>
                  <StudentDetails>
                    <StudentName>{student.name}</StudentName>
                    <StudentMeta>
                      <StudentMetaItem>
                        <FiUser />
                        ID: {student.id}
                      </StudentMetaItem>
                      <StudentMetaItem>
                        <FiPhone />
                        {formatPhone(student.tel)}
                      </StudentMetaItem>
                    </StudentMeta>
                    {student.remarks && (
                      <StudentRemarks>
                        <FiMessageSquare style={{ marginRight: '0.3rem' }} />
                        {student.remarks}
                      </StudentRemarks>
                    )}
                  </StudentDetails>
                </StudentInfo>
                <ChevronIcon>
                  <FiChevronRight />
                </ChevronIcon>
              </StudentHeader>
            </StudentCard>
          ))}
        </StudentsList>
      )}
    </StudentsContainer>
  );
};

export default Students; 