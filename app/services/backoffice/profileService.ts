"use client";

import { apiNoAuth } from "../../lib/axiosClient";
import type { Profile } from "../../types/backoffice/profile";

export const profileService = {
  get: () => apiNoAuth.get<Profile>("NilsenProfile/"),
};
