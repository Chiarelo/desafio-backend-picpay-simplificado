import { JwtService } from "@nestjs/jwt";
import { sign } from "crypto";
import { acessToken } from "./token-mock";

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue("token"),
    verifyAsync: jest.fn(),
  }
}
