export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserWithHash extends User {
  passwordHash: string;
}

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
}
