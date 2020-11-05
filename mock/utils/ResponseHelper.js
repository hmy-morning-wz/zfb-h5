
export function responseSuccess(res, data) {
  return res.status(200).json({
    code: 200,
    message: "OK",
    data,
  });
}

export function responseError(res, code, message) {
  return res.status(200).json({
    code,
    message,
  });
}
