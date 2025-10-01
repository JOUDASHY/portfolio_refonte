export type JwtTokens = {
  access: string;
  refresh: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

export type LoginResponse = JwtTokens & { user: AuthUser };

export type RegisterResponse = JwtTokens & { username: string };

export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};


