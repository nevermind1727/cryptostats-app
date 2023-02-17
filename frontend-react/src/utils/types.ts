// Users Api types
export type UserResponse = {
  _id: string;
  email: string;
  isCoinbaseAuthorized: boolean;
};

export type CreateUserParams = {
  email: string;
  password: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
};
