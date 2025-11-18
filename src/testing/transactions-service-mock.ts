import { TransactionsService } from "../transactions/transactions.service";

export const transactionsMock = {
  provide: TransactionsService,
  useValue: {
    Transfer: jest.fn(),
    processTransfer: jest.fn()
  }
}