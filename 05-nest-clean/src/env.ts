import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  // SALT_ROUNDS: z.coerce.number().optional().default(8),
  // CLIENT_URL: z.string(),
})

export type Env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)
