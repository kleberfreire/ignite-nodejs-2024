import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

import { hash } from 'bcryptjs'

import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    console.log(body)
    const { name, email, password } = body
    // const name = 'John Doe'
    // const email = 'johndoe@exemple.com'
    // const password = '123456'

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    const hashedPassword = await hash(password, 8)

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
