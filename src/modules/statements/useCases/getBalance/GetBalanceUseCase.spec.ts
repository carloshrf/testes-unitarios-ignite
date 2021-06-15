import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementRepository: InMemoryStatementsRepository

describe('', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository, inMemoryUserRepository
    )
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it('should be able to get the current user balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'cj',
      email: 'cj@email.com',
      password: '123456'
    })

    let balance
    if (user.id) {
      const { id } = user
      balance = await getBalanceUseCase.execute({ user_id: id })
    }

    expect(balance).toHaveProperty('balance')
    expect(balance?.balance).toBe(0)
  })
})
