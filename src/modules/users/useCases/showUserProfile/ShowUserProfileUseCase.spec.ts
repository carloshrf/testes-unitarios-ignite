import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository)
  })

  it('should be able to show an user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'cj',
      email: 'cj@email.com',
      password: '123456'
    })

    let userProfile

    if (user.id) {
      userProfile = await showUserProfileUseCase.execute(user.id);
    }

    expect(userProfile).toHaveProperty('id')
  })
});
