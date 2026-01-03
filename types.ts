
export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  grade: string;
  institution: string;
  verificationCode: string;
}

export type VerificationStatus = 'idle' | 'loading' | 'success' | 'not_found';
