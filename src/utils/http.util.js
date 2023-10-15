export const isSuccess = {
  success: (status, message, data) => {
    return {
      status,
      success: true,
      message,
      data,
    };
  },
  fail: (status, message) => {
    return {
      status,
      success: false,
      message,
    };
  },
};

export const statusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 600,
};

export class AppError extends Error {
  // status;
  // detail;

  constructor(status, message, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const message = {
  NULL_VALUE: "Nullable Value",
  REGEX_CHECK: "Regex Check",
  NOT_FOUND: "Not Found",
  BAD_REQUEST: "Bad Request",
  UNIQUE_CONSTRAINT_ERROR: "Unique Constraint Error",
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED: "Unauthorized Error",
  INTERNAL_SERVER_ERROR: "Server Error",
  READ_POST_SUCCESS: "Find Success",
  LOGIN_SUCCESS: "Login Success",
  CREATE_POST_SUCCESS: "Create Success",
  UPDATE_POST_SUCCESS: "Update Success",
  DELETE_POST_SUCCESS: "Delete Success",
};
