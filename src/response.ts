import { OutgoingHttpHeaders, ServerResponse } from 'http'
import { HTTPStatusCodes } from './status_codes'

export interface ResponseHeaders {
  [key: string]: string
}

export interface uResponse extends ServerResponse {
  defaultResponseHeaders: OutgoingHttpHeaders
  set: (key: string, value: string) => void
  sendStatus: (statusCode: number) => void
  status: (statusCode: HTTPStatusCodes) => uResponse
  send: (payload?: any) => void
}

export const ResponseBuilder = (response: ServerResponse): uResponse => {
  const extended: uResponse = response as any

  /**
   * Default Content-Type header.
   * @type {ResponseHeaders}
   */
  extended.defaultResponseHeaders = {
    'Content-Type': 'text/plain; charset=utf-8'
  }

  /**
   * Set header values for the response to be sent. This is just...
   * @param key
   * @param value
   */
  extended.set = function (key: string, value: string): void {
    this.setHeader(key, value)
  }

  /**
   * Sends an empty response with the response code only as the header.
   * @param statusCode
   */
  extended.sendStatus = function (statusCode: number): void {
    this.writeHead(statusCode, this.defaultResponseHeaders)

    let statusText: string = statusCode + ': UNKNOWN STATUS CODE'

    for (const text in HTTPStatusCodes) {
      if (HTTPStatusCodes[text] === statusCode as any) {
        statusText = `${statusCode}: ${text}`
      }
    }

    this.write(statusText)

    this.end()
  }

  /**
   * Sets the status code of the current response Object.
   * @param statusCode
   * @returns {uResponse}
   */
  extended.status = function (statusCode: HTTPStatusCodes): uResponse {
    // Sets the status code of the next response.
    this.statusCode = statusCode

    // Force type assertion as TS does not understand that the Object
    // has been dynamically merged.
    return this as any
  }

  extended.send = function (payload?: any): void {
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

    this.writeHead(
      this.statusCode,
      {
        ...this.defaultResponseHeaders,
        // Provide Content-Length header value.
        'Content-Length': contentLength
      }
    )

    // End connection and send off payload.
    this.end(Buffer.from(payload))
  }

  return extended
}
