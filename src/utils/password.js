export function checkPassword(pw) {
  return {
    letterDigit: /[A-Za-z]/.test(pw) && /\d/.test(pw),
    length: pw.length >= 8,
    special: /[^A-Za-z0-9]/.test(pw),
  }
}
