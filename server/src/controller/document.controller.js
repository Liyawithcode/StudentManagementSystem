let documents = [
  { id: "1", ownerId: "STU5032", name: "High School Diploma.pdf", url: "https://example.com/docs/stu5032_diploma.pdf", size: "1.2MB" }
];

export const getDocuments = async (req, res) => {
  res.status(200).json({ success: true, count: documents.length, documents });
};

export const uploadDocument = async (req, res) => {
  const { ownerId, name, url, size } = req.body;
  if (!ownerId || !name || !url) {
    return res.status(400).json({ success: false, message: "ownerId, name and url are required" });
  }

  const newDoc = { id: String(documents.length + 1), ownerId, name, url, size: size || "Unknown" };
  documents.push(newDoc);
  res.status(201).json({ success: true, message: "Document uploaded successfully", document: newDoc });
};

export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  documents = documents.filter(d => d.id !== id);
  res.status(200).json({ success: true, message: "Document deleted successfully" });
};
