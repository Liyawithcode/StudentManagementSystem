/**
 * Generic request body validation middleware.
 * Expects rules as an object where keys correspond to request body fields.
 */
export const validateRequest = (rules) => {
  return (req, res, next) => {
    const errors = {};
    const data = req.body || {};

    Object.keys(rules).forEach((key) => {
      const value = data[key];
      const rule = rules[key];

      // 1. Required field validation
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors[key] = `${key} is required.`;
        return;
      }

      // If value is provided, run remaining validation checks
      if (value !== undefined && value !== null && value !== "") {
        // 2. Type validation
        if (rule.type && typeof value !== rule.type) {
          errors[key] = `${key} must be a ${rule.type}.`;
          return;
        }

        // 3. Email validation
        if (rule.isEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[key] = `${key} must be a valid email address.`;
            return;
          }
        }

        // 4. Minimum length validation
        if (rule.minLength && String(value).length < rule.minLength) {
          errors[key] = `${key} must be at least ${rule.minLength} characters long.`;
          return;
        }

        // 5. Maximum length validation
        if (rule.maxLength && String(value).length > rule.maxLength) {
          errors[key] = `${key} must not exceed ${rule.maxLength} characters.`;
          return;
        }

        // 6. Custom validation callback
        if (rule.validate && typeof rule.validate === "function") {
          const customError = rule.validate(value);
          if (customError) {
            errors[key] = customError;
          }
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    next();
  };
};
