class AppError extends Error {
  constructor(message, statuscode, bodystatuscode) {
    super();
    this.message = message;
    this.statuscode = statuscode;
    this.status = 'fail';
    this.isoperational = true;
    this.bodystatuscode = bodystatuscode || statuscode;

    error.capturestacktrace(this, this.constructor);
  }
}

module.exports = AppError;
