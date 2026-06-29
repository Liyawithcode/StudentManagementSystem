export const generateStudentId = () => {
  return `STU${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateFacultyId = () => {
  return `FAC${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateAdminId = () => {
  return `ADM${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateCertificateId = () => {
  return `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
};

export default {
  generateStudentId,
  generateFacultyId,
  generateAdminId,
  generateCertificateId,
};
