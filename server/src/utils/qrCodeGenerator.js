export const generateQRCode = async (text) => {
  console.log(`[QR Code Generator] Generating mock QR Code for: ${text}`);
  return `[MOCK-QRCODE-FOR-${text}]`;
};

export default generateQRCode;
