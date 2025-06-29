
import { StudentInfo } from "@/types/authTypes";
import { supabase } from "@/lib/supabase";
import { fetchStudentFromMockDB } from "./mockStudentDatabase";

// Connect to university portal / mock SIS and verify student identity
export const verifyStudentByIdAndUniversity = async (
  studentId: string, 
  universityId: string
): Promise<StudentInfo | null> => {
  try {
    console.log(`Verifying student ${studentId} from university ${universityId}`);

    // First try to find record in mock SIS database for ZKP demo
    const fromMockDb = await fetchStudentFromMockDB(studentId, universityId);
    if (fromMockDb) {
      console.log("Found student in mock SIS DB for ZKP:", fromMockDb);
      return fromMockDb;
    }

    // If not in mock DB, check if we can connect to Supabase
    const { data: connectionCheck, error: connectionError } = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true });
      
    if (connectionError) {
      console.error("Could not connect to Supabase:", connectionError);
      // Fallback to mock verification if Supabase is not available
      return mockVerifyStudent(studentId, universityId);
    }
    
    // Call our verify_student function or query the students table directly
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .eq('university_name', universityId)
      .single();
    
    if (error || !data) {
      console.error("Error verifying student with Supabase:", error);
      // Fallback to mock verification
      return mockVerifyStudent(studentId, universityId);
    }
    
    console.log("Student verification successful via Supabase:", data);

    // Map Supabase data to StudentInfo type
    const studentInfo: StudentInfo = {
      fullName: data.full_name,
      contactNumber: data.contact_number || "",
      hashedGhanaCard: data.ghana_card_hash || "",
      universityName: data.university_name,
      studentId: data.student_id,
      graduationDate: data.graduation_date,
      gpa: data.gpa,
      isEnrolled: data.is_enrolled
    };
    
    return studentInfo;
  } catch (error) {
    console.error("Error verifying student:", error);
    // Fallback to mock verification in case of unexpected errors
    return mockVerifyStudent(studentId, universityId);
  }
};

// Mock verification function as fallback when Supabase is not available
const mockVerifyStudent = async (
  studentId: string, 
  universityId: string
): Promise<StudentInfo | null> => {
  console.log("Using mock verification as fallback");
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock GPA between 1.5 and 4.0
  const mockGPA = Math.round((Math.random() * 2.5 + 1.5) * 10) / 10;
  
  // Generate a graduation date between 6 months and 3 years from now
  const graduationDate = new Date();
  graduationDate.setMonth(graduationDate.getMonth() + Math.floor(Math.random() * 30) + 6);
  
  // Mock student info
  const studentInfo: StudentInfo = {
    fullName: generateMockName(studentId),
    contactNumber: generateMockPhone(),
    hashedGhanaCard: "",
    universityName: universityId,
    studentId: studentId,
    graduationDate: graduationDate.toISOString().split('T')[0],
    gpa: mockGPA,
    isEnrolled: true
  };
  
  console.log("Mock student verification completed:", studentInfo);
  return studentInfo;
};

// Helper functions from the original implementation
function generateMockName(studentId: string): string {
  const firstNames = ["Kwame", "Kofi", "Ama", "Abena", "Yaw", "Akosua", "Kwesi", "Efua"];
  const lastNames = ["Mensah", "Osei", "Boateng", "Owusu", "Acheampong", "Danso", "Amoah"];
  
  const nameIndex = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const firstName = firstNames[nameIndex % firstNames.length];
  const lastName = lastNames[(nameIndex + 3) % lastNames.length];
  
  return `${firstName} ${lastName}`;
}

function generateMockPhone(): string {
  return `+233${Math.floor(Math.random() * 900000000) + 100000000}`;
}
