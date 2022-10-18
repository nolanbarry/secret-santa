export function createMockBody(body: Record<string, any>): [any, any] {
  return [{
    body: JSON.stringify(body)
  }, {}]
}