import { APIGatewayProxyEvent } from "aws-lambda"

export function createMockBody<T>(body: Record<string, any>): [any, any] {
  return [{
    body: JSON.stringify(body)
  }, {}]
}

export function asPromise<T>(value: T): Promise<T> {
  return (async () => value)()
}