import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement By Operation", () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should be able to get deposit statements", async () => {
    const user = await createUserUseCase.execute({
      name: "User name",
      email: "user@email.com",
      password: "1234"
    });

    const dep = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10000,
      description: "Deposito",
      type: OperationType.DEPOSIT
    })

    await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: dep.id as string,
    })

    expect(200)
  });

  it("should not be able to get deposit statements", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: "deposit",
      })
    }).rejects.toBeInstanceOf(AppError)
  });

  it("should be able to get withdraw statements", async () => {
    const user = await createUserUseCase.execute({
      name: "User name",
      email: "user@email.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 1000,
      description: "Deposit",
      type: OperationType.DEPOSIT
    })

    const lev = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "Withdraw",
      type: OperationType.WITHDRAW
    })

    await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: lev.id as string,
    })

    expect(200)
  });

  it("should not be able to get all withdraw statements", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "200414",
        statement_id: "withdraw",
      })
    }).rejects.toBeInstanceOf(AppError)
  });

})