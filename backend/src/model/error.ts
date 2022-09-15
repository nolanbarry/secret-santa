/**
 * An exception that can be thrown at any time to halt the lambda and return
 * a response. The error will be caught by the scaffolding added by the `lambda()`
 * function used to decorate handlers. All errors thrown manually by Secret Santa
 * *should* be an `HTTPError` or descendant class.
 */
export class HTTPError {
  statusCode: number
  message: string

  /**
   * @param statusCode The HTTP status code, i.e. 404, 500
   * @param message The reason for exception, i.e. "User does not exist."
   */
  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode
    this.message = message
  }

  /** Formats the response body to be sent back to the client. */
  get body(): {[key: string]: any} {
    return {
      message: this.message
    }
  }
}


/**
 * An exception used when validation fails or the Lambda otherwise couldn't
 * complete the request due to the content of the request and not how it
 * was formatted. i.e., the user submits an invalid phone number. The client
 * will receive a 200 OK response, with the following body:
 * ```
 * {
 *  success: false,
 *  message: "Invalid phone number"
 * }
 * ```
 */
export class ExpectedError extends HTTPError {
  
  /**
   * @param message The reason the lambda couldn't complete the request.
   */
  constructor(message: string) {
    super(200, message)
  }

  get body() {
    return {
      ...super.body,
      success: false
    }
  }
}