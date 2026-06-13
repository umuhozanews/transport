declare module '../server/dist/app.js' {
  import type { Express } from 'express'
  export function createApp(): Express
}

declare module '../server/dist/lib/vercelDb.js' {
  export function setupServerlessDb(): void
}
