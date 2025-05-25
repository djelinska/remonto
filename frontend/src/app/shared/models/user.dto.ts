import { UserType } from '../enums/user-type';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: UserType;
}
