import bcrypt from "bcryptjs";
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
export default hashPassword;

export const isValidPassword = async (candidatePassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
  return isMatch;
};
