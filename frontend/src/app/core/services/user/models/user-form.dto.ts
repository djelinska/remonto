import { UserType } from '../../../../shared/enums/user-type';

export interface UserFormDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  type: UserType;
}
