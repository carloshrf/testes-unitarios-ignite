import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementRepository: InMemoryStatementsRepository

describe('', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository, inMemoryStatementRepository
    )
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository, inMemoryStatementRepository
    )
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it('should be able to list statement by id', async () => {
    const user = await createUserUseCase.execute({
      name: 'cj',
      email: 'cj@email.com',
      password: '123456'
    })

    const { id } = user

    const type = 'deposit' as OperationType
    const description = 'first deposit'
    const amount = 10

    let statementId
    let statement

    if (id) {
      const response = await createStatementUseCase.execute({
        user_id: id,
        type,
        amount,
        description
      })
      statementId = response.id

      if (statementId) {
        statement = await getStatementOperationUseCase.execute({
          user_id: id,
          statement_id: statementId
        })
      }
    }

    expect(statement).toHaveProperty('id')
    expect(statement?.amount).toBe(amount)
    expect(statement?.type).toEqual(type)
  })
});
