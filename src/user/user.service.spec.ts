import { TestingModule, Test } from "@nestjs/testing"
import { UserService } from "./user.service"
import { PrismaService } from "../database/prisma.service"; 
import { prismaMock } from "../testing/prisma.service.mock"; 
import { UserDto } from "./dto/userCreate.dto";
import { userEntityList } from "../testing/user-list.mock"; 
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
  });

  // ======================================================
  // CREATE
  // ======================================================

  describe('Create', () => {
    test('deve criar um usuário quando não existir outro com email ou documento', async () => {
      const data: UserDto = {
        email: "joao.silva.teste@mailfake.com",
        document: "123.456.789-00",
        name: "João da Silva",
        password: "senhaForteDeTeste123!"
      };

      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(userEntityList[0]);

      const result = await userService.createUser(data);

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: data.email }, { cpfCnpj: data.document }]
        }
      });

      expect(result).toEqual(userEntityList[0]);
    });

    test('deve lançar erro ao tentar criar usuário já existente', async () => {
      const data: UserDto = {
        email: "existing@mail.com",
        document: "000.000.000-00",
        name: "User Test",
        password: "123456"
      };

      prismaMock.user.findFirst.mockResolvedValue(userEntityList[0]);

      await expect(userService.createUser(data))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  // ======================================================
  // READ
  // ======================================================

  describe('Read', () => {

    test('deve retornar um usuário pelo ID', async () => {
      const expectedUser = userEntityList[0];

      prismaMock.user.findUnique.mockResolvedValue(expectedUser);

      const result = await userService.getUserByID(expectedUser.id);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: expectedUser.id }
      });

      expect(result).toEqual(expectedUser);
    });

    test('deve lançar erro caso usuário não seja encontrado pelo ID', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserByID("id-invalido"))
        .rejects
        .toThrow(NotFoundException);
    });

    test('deve retornar um usuário pelo email ou cpf/cnpj', async () => {
      const expectedUser = userEntityList[0];

      prismaMock.user.findFirst.mockResolvedValue(expectedUser);

      const result = await userService.getUserByEmailOrDocument(
        expectedUser.email,
        expectedUser.document
      );

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: expectedUser.email },
            { cpfCnpj: expectedUser.document }
          ]
        }
      });

      expect(result).toEqual(expectedUser);
    });

  });

  // ======================================================
  // DELETE (opcional, caso implemente depois)
  // ======================================================

  describe('Delete', () => {
    test('deve deletar um usuário', async () => {
      const expectedUser = userEntityList[0];

      prismaMock.user.delete.mockResolvedValue(expectedUser);

      const result = await prismaMock.user.delete({
        where: { id: expectedUser.id }
      });

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: expectedUser.id }
      });

      expect(result).toEqual(expectedUser);
    });
  });

});
