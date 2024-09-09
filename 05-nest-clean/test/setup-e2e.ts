import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { exec } from 'node:child_process'

console.log('setup-e2e.ts oi')

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Test cannot be run with DATABASE_URL set')
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}
const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  console.log('databaseUrl', databaseUrl)
  // await prisma.$connect()
  exec(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
