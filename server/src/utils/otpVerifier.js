export const verifyOTP = (userOtp, actualOtp, expireTime) => {
  if (!userOtp || !actualOtp) return false;
  if (userOtp !== actualOtp) return false;
  
  if (expireTime) {
    const isExpired = new Date() > new Date(expireTime);
    if (isExpired) return false;
  }
  
  return true;
};

export default verifyOTP;
