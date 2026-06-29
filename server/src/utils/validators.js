import { isValidEmail, isValidPhone, isValidPassword } from "./validation.js";
import { validateObjectId } from "./validateObjectId.js";

export const validators = {
  email: isValidEmail,
  phone: isValidPhone,
  password: isValidPassword,
  objectId: validateObjectId
};

export default validators;
