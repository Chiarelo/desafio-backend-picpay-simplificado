import { Test, type TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { userServiceMock } from "../testing/user-service-mock" 
import { jwtServiceMock } from "../testing/jwt-service.mock"
import { prismaMock } from "../testing/prisma.service.mock"
import { PrismaService } from "../database/prisma.service"
import { userEntityList } from "../testing/user-list.mock"
import { acessToken } from "../testing/token-mock"

describe('AuthService', () => {

  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        jwtServiceMock,
        userServiceMock,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService)
  });

  test('Validar a definição', () => {
    expect(authService).toBeDefined();
  })

  describe('Token', () => {
    test('CreateToken method', async () => {
      const result = await authService.createToken(userEntityList[0])

      expect(result).toEqual({
        accessToken: "token"
      })
    });

    describe('checkToken method', () => {

  test('deve validar um token válido', async () => {
    const payload = {
      sub: userEntityList[0].id,
      email: userEntityList[0].email,
      document: userEntityList[0].document,
      type: undefined
    };

    // mockando retorno de token válido
    jwtServiceMock.useValue.verifyAsync = jest.fn().mockResolvedValue(payload);

    const result = await authService.checkToken("token-valido");

    expect(result).toEqual(payload);
    expect(jwtServiceMock.useValue.verifyAsync).toHaveBeenCalledWith("token-valido");
  });

  test('deve lançar erro quando o token estiver expirado', async () => {
    const error = new Error("Token expirado");
    error.name = "TokenExpiredError";

    jwtServiceMock.useValue.verifyAsync = jest.fn().mockRejectedValue(error);

    await expect(authService.checkToken("token-expirado"))
      .rejects
      .toThrow("Token expirado");
  });

  test('deve lançar erro quando o token for inválido', async () => {
    const error = new Error("Token inválido");
    error.name = "JsonWebTokenError";

    jwtServiceMock.useValue.verifyAsync = jest.fn().mockRejectedValue(error);

    await expect(authService.checkToken("token-invalido"))
      .rejects
      .toThrow("Token inválido");
  });

});


  })
});
