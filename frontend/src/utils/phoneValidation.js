export function validatePhoneNumber(phoneNumber) {
  const trimmed = phoneNumber?.toString().trim();

  if (!trimmed) {
    return { isValid: false, message: "Phone number is required" };
  }

  if (!/^\d+$/.test(trimmed)) {
    return { isValid: false, message: "Phone number must contain only digits" };
  }

  if (trimmed.length !== 10) {
    return { isValid: false, message: "Phone number must be exactly 10 digits" };
  }

  if (!/^[6-9]/.test(trimmed)) {
    return { isValid: false, message: "Phone number must start with 6, 7, 8, or 9" };
  }

  return { isValid: true, message: "Valid phone number" };
}