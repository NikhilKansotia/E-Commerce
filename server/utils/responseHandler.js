export const responseHandler = ({
  res,
  statusCode = 200,
  message = "",
  success = false,
  error = null,
  data = null,
}) => {
  const responsePayload = { message, success };
  if (error) responsePayload.error = error;
  if (data) responsePayload.data = data;
  return res.status(statusCode).json(responsePayload);
};
