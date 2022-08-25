import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementRepositoryInMemory = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to create a deposit statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User name",
      email: "user@email.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "Deposito",
      type: OperationType.DEPOSIT
    })

    expect(201)
  })

  it("should not be able to create a deposit statement an invalid user", () => {
    expect(async() => {
      await createStatementUseCase.execute({
        user_id: "12345",
        amount: 100,
        description: "Deposito",
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able to create a withdraw statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User name",
      email: "user@email.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "Deposito",
      type: OperationType.DEPOSIT
    })

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      description: "withdraw",
      type: OperationType.WITHDRAW
    })

    expect(201)
  })

  it("should not be able to create a withdraw with insufficient statement", async () => {
    expect(async()=>{
      const user = await createUserUseCase.execute({
        name: "User name",
        email: "user@email.com",
        password: "1234"
      });
  
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 10,
        description: "withdraw",
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(AppError)
  })

})