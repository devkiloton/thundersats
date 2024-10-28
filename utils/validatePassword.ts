export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`-])(?=.{8,}).*$/;
  return passwordRegex.test(password);
}
