"use client";

import { apiAuth } from "../../lib/axiosClient";
import type { User } from "../../types/backoffice/user";

export const userService = {
  list: () => apiAuth.get<User[]>("users/"),
};


