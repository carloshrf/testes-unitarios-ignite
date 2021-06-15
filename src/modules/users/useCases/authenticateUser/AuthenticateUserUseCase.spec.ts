import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: IUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to authenticate an user', async () => {
    const user = new User()

    const email = 'cj@email.com';
    const password = '123456';

    Object.assign(user, {
      name: 'cj',
      email,
      password
    })

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({ email, password })

    expect(result).toHaveProperty('token');
  })
})
