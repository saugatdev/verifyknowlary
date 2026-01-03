
import { Certificate } from '../types';

export interface ExtendedCertificate extends Certificate {
  instructor: string;
}

const MOCK_FALLBACK: ExtendedCertificate[] = [
  {
    id: "KNL-2025-001",
    studentName: "Full Stack Development & AI",
    courseName: "Full Stack Development & AI",
    issueDate: "2025-02-20",
    grade: "Distinction",
    institution: "Knowlary Academy",
    verificationCode: "AUTH-8821",
    instructor: "DEMO"
  }
];

/**
 * Direct fetch for student data.
 * This is designed to be "open" - it tries the database first,
 * then falls back to the list above if the database isn't responding yet.
 */
export const verifyCertificate = async (id: string): Promise<ExtendedCertificate | null> => {
  const searchId = id.trim();
  
  // 1. Try to fetch directly from your MongoDB API
  try {
    const response = await fetch(`/api/verify/${searchId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log("Database fetch skipped or failed, using registry fallback.");
  }

  // 2. Fallback Registry (Simple demo data)
  await new Promise(r => setTimeout(r, 1000)); // Smooth loading feel
  
  const found = MOCK_FALLBACK.find(item => 
    item.id.toLowerCase() === searchId.toLowerCase() || 
    item.verificationCode === searchId ||
    item.studentName.toLowerCase() === searchId.toLowerCase()
  );

  return found || null;
};
