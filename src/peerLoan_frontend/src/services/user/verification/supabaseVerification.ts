
import { supabase } from "@/lib/supabase";
import { StudentInfo } from "@/types/authTypes";

export const getStudentVerificationFromSupabase = async (principalId: string): Promise<StudentInfo | null> => {
  try {
    const { data: verification, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('principal_id', principalId)
      .single();
    
    if (error || !verification) {
      throw new Error("No verification in Supabase");
    }
    
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', verification.student_id)
      .eq('university_name', verification.university_name)
      .single();
    
    if (studentError || !student) {
      throw new Error("No student data in Supabase");
    }
    
    // Map to StudentInfo
    const studentInfo: StudentInfo = {
      fullName: student.full_name,
      contactNumber: student.contact_number || "",
      hashedGhanaCard: student.ghana_card_hash || "",
      universityName: student.university_name,
      studentId: student.student_id,
      graduationDate: student.graduation_date,
      gpa: student.gpa,
      isEnrolled: student.is_enrolled,
      zkVerification: {
        verifiedAt: verification.verified_at,
        expiresAt: verification.expires_at,
        proofType: verification.proof_type,
        verifier: verification.verifier
      }
    };
    
    return studentInfo;
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    throw error;
  }
};
