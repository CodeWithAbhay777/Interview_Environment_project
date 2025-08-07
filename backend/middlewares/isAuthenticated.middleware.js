import jwt from "jsonwebtoken";
import { checkForRefreshToken } from "../utils/checkForRefreshToken.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.jobify_access_token;
    const refreshToken = req.cookies?.jobify_refresh_token;

    if (!accessToken && !refreshToken) {
      
        throw new Error(401, "Unauthorized request : No token found");
      }

      if (!accessToken) {
        await checkForRefreshToken(refreshToken, req, res, next);
      }

      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      req.id = decoded.userId;

      next();
  } catch (error) {
    console.log(error.name);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      const refreshToken = req.cookies?.jobify_refresh_token;
      
      await checkForRefreshToken(refreshToken, req, res, next);
    }

    throw new Error(401, error?.message || "Unauthorized request : Invalid access token");
  }
};

export default isAuthenticated;
