export const accessCookieOptions = {
  httpOnly: true,
  //   secure: true,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export const refreshCookieOptions = {
  httpOnly: true,
  //   secure: true,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
}
