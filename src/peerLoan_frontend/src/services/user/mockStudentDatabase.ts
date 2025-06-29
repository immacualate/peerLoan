
import { StudentInfo } from "@/types/authTypes";

// Mock student database for ZKP demo purposes
// This simulates what would be stored in Supabase
const mockStudents = [
  {
    studentId: "UG2023001",
    universityName: "University of Ghana",
    fullName: "Kwame Mensah",
    contactNumber: "+233541234567",
    hashedGhanaCard: "gh-card-hash-1",
    graduationDate: "2026-06-30",
    gpa: 3.7,
    isEnrolled: true
  },
  {
    studentId: "KNUST2023005",
    universityName: "Kwame Nkrumah University of Science and Technology",
    fullName: "Abena Osei",
    contactNumber: "+233559876543",
    hashedGhanaCard: "gh-card-hash-2",
    graduationDate: "2025-12-15",
    gpa: 3.4,
    isEnrolled: true
  },
  {
    studentId: "UCC2022103",
    universityName: "University of Cape Coast",
    fullName: "Kofi Boateng",
    contactNumber: "+233561122334",
    hashedGhanaCard: "gh-card-hash-3",
    graduationDate: "2026-01-20",
    gpa: 3.9,
    isEnrolled: true
  }
];

// Function to fetch student from mock database
export const fetchStudentFromMockDB = async (
  studentId: string, 
  universityName: string
): Promise<StudentInfo | null> => {
  console.log(`Checking mock DB for student: ${studentId} at ${universityName}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find matching student
  const student = mockStudents.find(s => 
    s.studentId === studentId && 
    s.universityName === universityName
  );
  
  if (!student) {
    console.log("No matching student found in mock DB");
    return null;
  }
  
  console.log("Found student in mock DB:", student);
  
  return {
    fullName: student.fullName,
    contactNumber: student.contactNumber,
    hashedGhanaCard: student.hashedGhanaCard,
    universityName: student.universityName,
    studentId: student.studentId,
    graduationDate: student.graduationDate,
    gpa: student.gpa,
    isEnrolled: student.isEnrolled,
    zkVerification: {
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      proofType: "zk-student-verification-v1",
      verifier: "adanfo-academic-verifier"
    }
  };
};
