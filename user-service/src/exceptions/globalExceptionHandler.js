module.exports = (err, req, res, next) => {
  console.error("LOG LỖI:", err.message);

  const explicitStatus = Number(err.statusCode || err.status || 0);
  const hasExplicitStatus =
    Number.isInteger(explicitStatus) && explicitStatus >= 400;

  const status = hasExplicitStatus
    ? explicitStatus
    : err.message.includes("không") || err.message.includes("tồn tại")
      ? 400
      : 500;

  res.status(status).json({
    success: false,
    message: err.message || "Lỗi hệ thống nội bộ",
    timestamp: new Date().toISOString(),
  });
};
