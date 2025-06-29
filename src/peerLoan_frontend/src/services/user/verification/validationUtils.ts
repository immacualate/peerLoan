
import { StudentInfo } from "@/types/authTypes";

export const validateStudentInfo = (studentInfo: StudentInfo): boolean => {
  try {
    if (!studentInfo.universityName || !studentInfo.studentId || 
        !studentInfo.graduationDate) {
      console.error("Missing required student info fields:", studentInfo);
      return false;
    }
    
    const graduationDate = new Date(studentInfo.graduationDate);
    const fiveMonthsFromNow = new Date();
    fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
    
    if (graduationDate < fiveMonthsFromNow) {
      console.error("Graduation date must be at least 5 months away");
      return false;
    }
    
    if (studentInfo.gpa < 1.5) {
      console.error("GPA must be at least 1.5");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error validating student info:", error);
    return false;
  }
};

export const validateStudentEligibility = (
  studentInfo: StudentInfo,
  loanDurationMonths: number
): { isEligible: boolean, reason?: string } => {
  try {
    const graduationDate = new Date(studentInfo.graduationDate);
    const durationEndDate = new Date();
    durationEndDate.setMonth(durationEndDate.getMonth() + loanDurationMonths);
    
    if (durationEndDate > new Date(graduationDate.getTime() + 30 * 24 * 60 * 60 * 1000)) {
      return { 
        isEligible: false, 
        reason: `Loan duration extends past your graduation date (${graduationDate.toLocaleDateString()}). Please select a shorter duration.` 
      };
    }
    
    if (studentInfo.gpa < 1.5) {
      return { 
        isEligible: false, 
        reason: `Your GPA (${studentInfo.gpa}) is below the minimum requirement of 1.5.` 
      };
    }
    
    return { isEligible: true };
  } catch (error) {
    console.error("Error validating eligibility:", error);
    return { isEligible: false, reason: "An error occurred while checking eligibility." };
  }
};
