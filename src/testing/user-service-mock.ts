import { UserService } from "../user/user.service";

export const userServiceMock = {
  provide: UserService, 
  useValue : {
    getUserByEmailOrDocument: jest.fn(),
    createUser: jest.fn(),
    getUserByID: jest.fn()
  }
}