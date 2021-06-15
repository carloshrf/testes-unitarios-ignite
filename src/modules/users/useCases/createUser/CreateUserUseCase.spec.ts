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
})
