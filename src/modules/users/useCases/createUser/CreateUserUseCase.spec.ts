import { STATUS_CODES } from "http";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO"


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "New User",
      email: "test@email.com",
      password: "supersenha123",
    }

    await createUserUseCase.execute(user)

    expect(201);
  });

  it("should not be able to create a user with an existing email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "User Name2",
        email: "user@email.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})