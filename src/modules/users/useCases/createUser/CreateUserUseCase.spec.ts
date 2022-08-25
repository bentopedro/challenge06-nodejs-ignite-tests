import { STATUS_CODES } from "http";
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
      email: "test@emai.com",
      password: "supersenha123",
    }

    await createUserUseCase.execute(user)

    // console.log(resp);

    expect(STATUS_CODES).toBe(201)
  })
})