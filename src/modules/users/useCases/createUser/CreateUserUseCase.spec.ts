import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe('Create User', () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUserRepository
    );
  })

  it('should be able to create an user', async () => {
    const user = new User()

    const email = 'cj@email.com';
    const password = '123456';

    Object.assign(user, {
      name: 'cj',
      email,
      password
    })

    const response = await createUserUseCase.execute(user)

    expect(response).toHaveProperty('id')
  })

  it('should not be able to create an user with a registered email', async () => {
    const email = 'cj@email.com';
    const password = '123456';

    const user1 = {
      name: 'cj',
      email,
      password
    }

    const user2 = {
      name: 'Carl Johnson',
      email,
      password: '123123'
    }

    await createUserUseCase.execute(user1)

    expect( async () => {
      await createUserUseCase.execute(user2)
    }).rejects.toBeInstanceOf(AppError)
  })
})
