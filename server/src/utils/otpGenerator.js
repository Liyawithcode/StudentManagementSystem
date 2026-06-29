export const generateOTP = (length = 6) => {
    if (length === 6) {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
};

export default generateOTP;
