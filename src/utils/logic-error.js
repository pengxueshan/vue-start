export default class LogicError extends Error {
  constructor({
    code = 500,
    msg = 'Unknown client error',
    data
  } = {}) {
    super(msg);
    this.data = data;
    this.msg = msg;
    this.code = code;
  }

  set code(errorCode) {
    this.code = code;
  }
}
