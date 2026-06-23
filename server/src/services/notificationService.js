import { Announcement } from "../model/announcement.model.js";

export const createNotification = async (title, content, audience, author, sentEmail) => {
  return await Announcement.create({
    title,
    content,
    audience: audience || "All",
    author: author || "System Admin",
    sentEmail: !!sentEmail
  });
};

export const getNotificationsList = async () => {
  return await Announcement.find();
};
