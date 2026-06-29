export const generateCSV = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];
  
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ("" + (val ?? "")).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
};

export default generateCSV;
