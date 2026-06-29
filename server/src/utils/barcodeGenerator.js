export const generateBarcode = async (text) => {
  console.log(`[Barcode Generator] Generating mock barcode for: ${text}`);
  return `||||| BARCODE-${text} |||||`;
};

export default generateBarcode;
