
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          student_id: string
          university_name: string
          full_name: string
          gpa: number
          graduation_date: string
          is_enrolled: boolean
          program: string
          ghana_card_hash: string | null
          contact_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          university_name: string
          full_name: string
          gpa: number
          graduation_date: string
          is_enrolled: boolean
          program: string
          ghana_card_hash?: string | null
          contact_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          university_name?: string
          full_name?: string
          gpa?: number
          graduation_date?: string
          is_enrolled?: boolean
          program?: string
          ghana_card_hash?: string | null
          contact_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      verifications: {
        Row: {
          id: string
          principal_id: string
          student_id: string
          university_name: string
          verified_at: string
          expires_at: string
          proof_type: string
          verifier: string
          created_at: string
        }
        Insert: {
          id?: string
          principal_id: string
          student_id: string
          university_name: string
          verified_at: string
          expires_at: string
          proof_type: string
          verifier: string
          created_at?: string
        }
        Update: {
          id?: string
          principal_id?: string
          student_id?: string
          university_name?: string
          verified_at?: string
          expires_at?: string
          proof_type?: string
          verifier?: string
          created_at?: string
        }
      }
      loan_requests: {
        Row: {
          id: string
          borrower_id: string
          amount: number
          purpose: string
          duration: number
          interest_rate: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          borrower_id: string
          amount: number
          purpose: string
          duration: number
          interest_rate: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          borrower_id?: string
          amount?: number
          purpose?: string
          duration?: number
          interest_rate?: number
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_student: {
        Args: {
          p_student_id: string
          p_university_name: string
        }
        Returns: {
          is_verified: boolean
          full_name: string | null
          gpa: number | null
          graduation_date: string | null
          is_enrolled: boolean | null
        }
      }
    }
  }
}
