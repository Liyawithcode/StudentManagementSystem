export const generatePDF = async (data, templateName = "default") => {
  console.log(`[PDF Generator] Simulating PDF generation using template: ${templateName}`);
  return Buffer.from("%PDF-1.4 mock pdf content data stream placeholder");
};

export default generatePDF;
