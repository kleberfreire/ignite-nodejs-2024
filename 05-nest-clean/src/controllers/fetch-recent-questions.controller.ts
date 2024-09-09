import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1).int()),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().min(1).int()),
})

type QuerySchema = z.infer<typeof querySchema>
const queryValidationPipe = new ZodValidationPipe(querySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query(queryValidationPipe) queryParam: QuerySchema) {
    const page = queryParam.page
    const limit = queryParam.limit
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: page ? (page - 1) * limit : 0,
    })

    return { questions }
  }
}
