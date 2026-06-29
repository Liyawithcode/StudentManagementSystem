export const generateExcel = async (data, sheetName = "Sheet1") => {
  console.log(`[Excel Generator] Simulating Excel sheet generation for: ${sheetName}`);
  return Buffer.from("mock excel sheet content data stream placeholder");
};

export default generateExcel;
