import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementRepository: InMemoryStatementsRepository

describe('', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository, inMemoryStatementRepository
    )
  })

  it('should be able to make a deposit', async () => {
    const user = await createUserUseCase.execute({
      name: 'cj',
      email: 'cj@email.com',
      password: '123456'
    })

    const { id } = user
    const type = 'deposit' as OperationType
    const description = 'first deposit'
    const amount = 10
    let statement

    if (id) {
      statement = await createStatementUseCase.execute({
        user_id: id,
        type,
        amount,
        description
      })
    }

    expect(statement).toHaveProperty('id')
    expect(statement?.amount).toBe(amount)
    expect(statement?.type).toEqual(type)
  })

  it('should be able to make a withdraw', async () => {
    const user = await createUserUseCase.execute({
      name: 'cj',
      email: 'cj@email.com',
      password: '123456'
    })

    const { id } = user
    const deposit = 'deposit' as OperationType
    const withdraw = 'withdraw' as OperationType
    const description = 'first deposit'
    const amount = 10
    let statement

    if (id) {
      await createStatementUseCase.execute({
        user_id: id,
        type: deposit,
        amount,
        description
      })

      statement = await createStatementUseCase.execute({
        user_id: id,
        type: withdraw,
        amount,
        description
      })
    }

    expect(statement).toHaveProperty('id')
    expect(statement?.amount).toBe(amount)
    expect(statement?.type).toBe(withdraw)
  })
})
