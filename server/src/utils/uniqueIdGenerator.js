import { generateStudentId, generateFacultyId, generateAdminId, generateCertificateId } from "./idGenerator.js";

export const generateUniqueId = (type) => {
  switch (type?.toLowerCase()) {
    case "student": return generateStudentId();
    case "faculty":
    case "teacher": return generateFacultyId();
    case "admin": return generateAdminId();
    case "certificate": return generateCertificateId();
    default: return `ID-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
};

export default generateUniqueId;
