declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      NEXT_PUBLIC_CDN_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      CLOUDFLARE_R2_ACCOUNT_ID?: string
      CLOUDFLARE_R2_ENDPOINT?: string
      CLOUDFLARE_R2_BUCKET?: string
      CLOUDFLARE_R2_ACCESS_KEY_ID?: string
      CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string
      CLOUDFLARE_R2_REGION?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
