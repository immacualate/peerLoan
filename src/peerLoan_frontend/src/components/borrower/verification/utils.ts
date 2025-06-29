
import * as crypto from 'crypto-js';
import { StudentVerificationValues } from './types';
import { StudentInfo } from '@/types/authTypes';

export const hashGhanaCardNumber = (cardNumber: string): string => {
  return crypto.SHA256(cardNumber).toString();
};

export const verifyGPAFromAcademicSource = async (studentId: string, university: string): Promise<number> => {
  // Simulated API call to verify GPA
  await new Promise(resolve => setTimeout(resolve, 1500));
  const simulatedGPA = Math.round((Math.random() * 2.5 + 1.5) * 10) / 10;
  return simulatedGPA;
};

export const validateVerificationData = (data: StudentVerificationValues): boolean => {
  try {
    // Additional validation logic if needed
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
};

export const createStudentInfoFromFormData = async (
  data: StudentVerificationValues
): Promise<StudentInfo> => {
  const hashedGhanaCardNumber = hashGhanaCardNumber(data.ghanaCardNumber);
  const verifiedGPA = await verifyGPAFromAcademicSource(data.studentId, data.universityName);
  
  return {
    fullName: data.fullName,
    contactNumber: data.contactNumber,
    hashedGhanaCard: hashedGhanaCardNumber,
    universityName: data.universityName,
    studentId: data.studentId,
    graduationDate: data.graduationDate,
    gpa: verifiedGPA,
    isEnrolled: true
  };
};
