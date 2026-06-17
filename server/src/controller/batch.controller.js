let batches = [
  { id: "1", year: "2024", label: "Batch of 2024" },
  { id: "2", year: "2025", label: "Batch of 2025" }
];

export const getBatches = async (req, res) => {
  res.status(200).json({ success: true, count: batches.length, batches });
};

export const createBatch = async (req, res) => {
  const { year, label } = req.body;
  if (!year) return res.status(400).json({ success: false, message: "Year is required" });

  const newBatch = { id: String(batches.length + 1), year, label: label || `Batch of ${year}` };
  batches.push(newBatch);
  res.status(201).json({ success: true, message: "Batch created successfully", batch: newBatch });
};

export const deleteBatch = async (req, res) => {
  const { id } = req.params;
  batches = batches.filter(b => b.id !== id);
  res.status(200).json({ success: true, message: "Batch deleted successfully" });
};
