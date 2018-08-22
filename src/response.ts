import { ServerResponse } from 'http'
import { HTTPStatusCodes } from './status_codes'

export type uResponse = ServerResponse & uResponseBuilder

export interface ResponseHeaders {
  [key: string]: string
}

export class uResponseBuilder {

  /**
   * Reference to the original Node ServerResponse object.
   */
  nativeResponse: ServerResponse

  /**
   * Default response status code.
   * @type {number}
   * @private
   */
  private statusCode: HTTPStatusCodes = 200

  /**
   * Default Content-Type header.
   * @type {ResponseHeaders}
   */
  static defaultResponseHeaders: ResponseHeaders = {
    'Content-Type': 'text/plain; charset=utf-8'
  }

  constructor (_res: ServerResponse) {
    this.nativeResponse = _res
  }

  public static create (res: ServerResponse): uResponse {
    // Extended response object.
    const microResponse = new uResponseBuilder(res)

    // Merge properties of ServerResponse with uResponse.
    for (let method in microResponse) {
      res[method] = microResponse[method]
    }

    return res as uResponse
  }

  /**
   * Set header values for the response to be sent. This is just...
   * @param key
   * @param value
   */
  public set (key: string, value: string): void {
    this.nativeResponse.setHeader(key, value)
  }

  /**
   * Sends an empty response with the response code only as the header.
   * @param statusCode
   */
  public sendStatus (statusCode: number): void {
    this.nativeResponse.writeHead(statusCode, uResponseBuilder.defaultResponseHeaders)

    let statusText: string = statusCode + ': UNKNOWN STATUS CODE'

    for (const text in HTTPStatusCodes) {
      if (HTTPStatusCodes[text] === statusCode as any) {
        statusText = `${statusCode}: ${text}`
      }
    }

    this.nativeResponse.write(statusText)

    this.nativeResponse.end()
  }

  /**
   * Sets the status code of the current response Object.
   * @param statusCode
   * @returns {uResponse}
   */
  public status (statusCode: HTTPStatusCodes): uResponse {
    // Sets the status code of the next response.
    this.statusCode = statusCode

    // Force type assertion as TS does not understand that the Object
    // has been dynamically merged.
    return this as any
  }

  public send (payload?: any): void {
    // Determine what the final payload should be by analyzing it's
    // type.
    const payloadType = typeof payload

    // Convert payload to string if type is of Object.
    if (payloadType === 'object') {
      payload = JSON.stringify(payload)
    }

    // Provide fallback content.
    payload = payload || ''

    const contentLength = payload.length

    this.nativeResponse.writeHead(
      this.statusCode,
      {
        ...uResponseBuilder.defaultResponseHeaders,
        // Provide Content-Length header value.
        'Content-Length': contentLength
      }
    )

    // End connection and send off payload.
    this.nativeResponse.end(Buffer.from(payload))
  }
}
