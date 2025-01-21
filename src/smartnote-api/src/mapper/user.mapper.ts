import User from "../interfaces/user";

class UserMapper {
  static MapUserInfo = (decodedJwt: any): User => {
    return {
      userId: decodedJwt.nameidentifier,
      roles: decodedJwt.role,
    } as User;
  };
}

export default UserMapper;
