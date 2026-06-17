export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }
    
    const userObj = req.user.toObject();
    delete userObj.password;
    delete userObj.verifyOtp;
    delete userObj.verifyOtpExpire;

    res.status(200).json({ success: true, profile: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const user = req.user;
    const { email, password, role, isVerified, ...updates } = req.body;

    Object.assign(user, updates);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ success: true, message: "Profile updated successfully", profile: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
