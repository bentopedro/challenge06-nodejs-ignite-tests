import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  })

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "New User",
      email: "test@email.com",
      password: "supersenha123",
    }

    const userCreated = await createUserUseCase.execute(user)

    const result = await showUserProfileUseCase.execute(userCreated.id as string)

    expect(result).toEqual(userCreated)
  });

  it("should be able to show a profile from a invalid user", () => {
    expect(async () => {
      const user: ICreateUserDTO = await createUserUseCase.execute( {
        name: "New User",
        email: "test@email.com",
        password: "supersenha123",
      })

      await showUserProfileUseCase.execute("uuid-invalid")

    }).rejects.toBeInstanceOf(AppError);
  })
})