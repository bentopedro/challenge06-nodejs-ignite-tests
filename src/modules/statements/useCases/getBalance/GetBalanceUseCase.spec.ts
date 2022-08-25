import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  });

  it("should be able to get balance for user", async () => {
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

    const balanceResult = await getBalanceUseCase.execute({
      user_id: user.id as string
    })

    // console.log(balance)
    expect(balanceResult).toHaveProperty("balance")
  });

  it("should not be able to get balance for invalid user", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User name",
        email: "user@email.com",
        password: "1234"
      });

      await getBalanceUseCase.execute({
        user_id: "4411440"
      })
    }).rejects.toBeInstanceOf(AppError)
  });

})