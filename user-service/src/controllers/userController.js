const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const authFilter = require("../filters/authFilter");
const { UserResponseDTO } = require("../dto/userDto");
const jwtConfig = require("../config/jwtConfig");

function getRefreshCookieSameSite() {
  const sameSite = String(
    jwtConfig.refreshCookieSameSite || "lax",
  ).toLowerCase();

  if (sameSite === "strict") {
    return "strict";
  }

  if (sameSite === "none") {
    return "none";
  }

  return "lax";
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: jwtConfig.refreshCookieSecure,
    sameSite: getRefreshCookieSameSite(),
    path: jwtConfig.refreshCookiePath,
    maxAge: jwtConfig.refreshTokenTtlMs,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({
      message: "Đăng ký thành công",
      data: new UserResponseDTO(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await userService.login(username, password);

    res.cookie(
      jwtConfig.refreshCookieName,
      result.refreshToken,
      refreshCookieOptions(),
    );

    res.json({
      token: result.accessToken,
      accessToken: result.accessToken,
      user: new UserResponseDTO(result.user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[jwtConfig.refreshCookieName];
    const result = await userService.refresh(refreshToken);

    res.cookie(
      jwtConfig.refreshCookieName,
      result.refreshToken,
      refreshCookieOptions(),
    );

    res.json({
      token: result.accessToken,
      accessToken: result.accessToken,
      user: new UserResponseDTO(result.user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authFilter, async (req, res, next) => {
  try {
    await userService.logout(req.user?.id);
    res.clearCookie(jwtConfig.refreshCookieName, {
      httpOnly: true,
      secure: jwtConfig.refreshCookieSecure,
      sameSite: getRefreshCookieSameSite(),
      path: jwtConfig.refreshCookiePath,
    });

    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    next(error);
  }
});

router.get("/", authFilter, async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users.map((u) => new UserResponseDTO(u)));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
