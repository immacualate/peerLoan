
import { User, StudentInfo } from "@/types/authTypes";
import { getAdanfoCashActor } from "../icp/actor";

// Using dynamic import for Principal to avoid build errors
let Principal: any;

// Safely import Principal or provide a mock implementation
const getPrincipal = async () => {
  try {
    if (import.meta.env.VITE_ICP_ENABLED === 'true') {
      const module = await import('@dfinity/principal');
      Principal = module.Principal;
    } else {
      // Mock Principal for development
      Principal = {
        fromText: (text: string) => ({
          _isPrincipal: true,
          toString: () => text
        })
      };
    }
  } catch (e) {
    console.warn("Failed to import Principal, using mock implementation");
    // Mock Principal implementation
    Principal = {
      fromText: (text: string) => ({
        _isPrincipal: true,
        toString: () => text
      })
    };
  }
};

// Initialize Principal on module load
getPrincipal();

export const verifyStudentWithICP = async (user: User, studentInfo: StudentInfo) => {
  try {
    // Get the actor for our backend canister
    const actor = await getAdanfoCashActor();
    
    // Convert user ID to Principal, ensuring it's available
    await getPrincipal();
    const userPrincipal = Principal.fromText(user.principalId);
    
    // Call the backend canister to verify the student
    const result = await actor.verifyStudent(userPrincipal, {
      fullName: studentInfo.fullName ? [studentInfo.fullName] : [],
      contactNumber: studentInfo.contactNumber ? [studentInfo.contactNumber] : [],
      hashedGhanaCard: studentInfo.hashedGhanaCard ? [studentInfo.hashedGhanaCard] : [],
      universityName: studentInfo.universityName,
      studentId: studentInfo.studentId,
      gpa: studentInfo.gpa,
      graduationDate: studentInfo.graduationDate,
      isEnrolled: studentInfo.isEnrolled
    });
    
    if ('Ok' in result) {
      return {
        success: true,
        message: "Student verification successful"
      };
    } else {
      return {
        success: false,
        message: `Error verifying student: ${result.Err}`
      };
    }
  } catch (error) {
    console.error("Error verifying student with ICP:", error);
    return {
      success: false,
      message: "Failed to connect to ICP network. Please try again later."
    };
  }
};

export const checkStudentVerificationWithICP = async (user: User) => {
  try {
    // In a full implementation, we would check the verification status
    // For now, we'll assume it's verified if we have user data
    return {
      isVerified: !!user.studentInfo,
      verificationData: user.studentInfo
    };
  } catch (error) {
    console.error("Error checking student verification with ICP:", error);
    return {
      isVerified: false,
      verificationData: null
    };
  }
};
