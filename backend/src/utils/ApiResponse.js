class ApiResponse {
  constructor({ statusCode, message, data = null, success }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  // Message only
  static message(statusCode, message) {
    return new ApiResponse({
      statusCode,
      message,
      success: statusCode < 400,
    });
  }

  // Message + data
  static data(statusCode, data, message = "Success") {
    return new ApiResponse({
      statusCode,
      message,
      success: statusCode < 400,
      data,
    });
  }

  // Paginated result
  static pagination(statusCode, data, total, hasNext, message = "Success") {
    return new ApiResponse({
      statusCode,
      message,
      success: statusCode < 400,
      data,
      total,
      hasNext,
    });
  }
}

export { ApiResponse };
