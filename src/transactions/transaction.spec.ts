import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsService } from "./transactions.service";
import { PrismaService } from "../database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { prismaMock } from "../testing/prisma.service.mock";
import { userServiceMock } from "../testing/user-service-mock";
import { UnauthorizedException, BadRequestException } from "@nestjs/common";

global.fetch = jest.fn(); // mock global fetch

describe("TransactionsService", () => {
  let service: TransactionsService;

  const mockUser = {
    id: "payer-001",
    type: "COMMON",
    balance: 100,
  };

  const dto = {
    payer: "payer-001",
    payee: "payee-001",
    value: 50,
  };

  beforeEach(async () => {
    (fetch as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: {} },
        userServiceMock,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  test("Serviço definido", () => {
    expect(service).toBeDefined();
  });

  // ==========================
  //   TRANSFER TESTES
  // ==========================
  describe("transfer()", () => {
    test("deve lançar erro caso o payer seja diferente do usuário autenticado", async () => {
      await expect(
        service.transfer(
          { ...mockUser, id: "diferente" } as any,
          dto
        )
      ).rejects.toThrow(UnauthorizedException);
    });

    test("MERCHANT não pode enviar dinheiro", async () => {
      await expect(
        service.transfer(
          { ...mockUser, type: "MERCHANT" } as any,
          dto
        )
      ).rejects.toThrow(UnauthorizedException);
    });

    test("saldo insuficiente deve lançar erro", async () => {
      await expect(
        service.transfer(
          { ...mockUser, balance: 10 } as any,
          dto
        )
      ).rejects.toThrow(BadRequestException);
    });

    test("valor inválido (<=0) deve lançar erro", async () => {
      await expect(
        service.transfer(
          mockUser as any,
          { ...dto, value: 0 }
        )
      ).rejects.toThrow(BadRequestException);
    });

    test("payee inexistente deve lançar erro", async () => {
      userServiceMock.useValue.getUserByID.mockResolvedValue(null);

      await expect(
        service.transfer(mockUser as any, dto)
      ).rejects.toThrow(BadRequestException);
    });

    test("serviço externo deve negar a transferência se não for success", async () => {
      userServiceMock.useValue.getUserByID.mockResolvedValue({ id: "payee-001" });

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ status: "denied" }),
      });

      await expect(
        service.transfer(mockUser as any, dto)
      ).rejects.toThrow(UnauthorizedException);
    });

    test("deve realizar transferência com sucesso", async () => {
      userServiceMock.useValue.getUserByID.mockResolvedValue({ id: "payee-001" });

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ status: "success" }),
      });

      prismaMock.$transaction = jest.fn().mockImplementation((cb) =>
        cb({
          user: {
            update: jest.fn(),
          },
          transaction: {
            create: jest.fn(),
          },
        })
      );

      await expect(
        service.transfer(mockUser as any, dto)
      ).resolves.not.toThrow();
    });
  });
});
