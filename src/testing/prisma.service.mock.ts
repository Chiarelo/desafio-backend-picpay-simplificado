import { PrismaService } from "../database/prisma.service";
import { userEntityList } from "./user-list.mock";

export const prismaMock = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  transaction: {
    create: jest.fn(),
  },

  $transaction: jest.fn(async (cb) => {
    return cb(prismaMock);
  }),
};
