import { generateCertificateId } from "../utils/index.js";

export const generateCertificate = async (req, res) => {
  try {
    const { studentId, certificateType } = req.body; // e.g. "Transfer Certificate", "Bonafide", "Character Certificate"
    if (!studentId || !certificateType) {
      return res.status(400).json({ success: false, message: "studentId and certificateType are required" });
    }

    // Generate formatted stub certificate details
    const certificate = {
      certificateId: generateCertificateId(),
      studentId,
      type: certificateType,
      issueDate: new Date().toISOString().split("T")[0],
      validity: "Lifetime",
      authoritySignature: "Principal / Registrar"
    };

    res.status(201).json({ success: true, message: `${certificateType} generated successfully`, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
