import { Announcement } from "../model/announcement.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendNotification = async (req, res) => {
  try {
    const { title, content, audience, sendEmailAlert } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const notification = await Announcement.create({
      title,
      content,
      audience: audience || "All",
      author: req.user ? req.user.email : "System Admin",
      sentEmail: !!sendEmailAlert
    });

    // Email Broadcasting stub/logic
    if (sendEmailAlert) {
      console.log(`Broadcasting alert to audience ${audience}: ${title}`);
      // In real-world, we'd fetch all users in the audience and email them.
    }

    res.status(201).json({ success: true, message: "Notification sent successfully", notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Announcement.find();
    res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
