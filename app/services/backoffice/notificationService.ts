"use client";

import { apiAuth } from "../../lib/axiosClient";
import type { Notification } from "../../types/backoffice/notification";

export const notificationService = {
  list: () => apiAuth.get<Notification[]>("notifications/"),
  create: (payload: Pick<Notification, "title" | "message">) => apiAuth.post("notifications/", payload),
  markRead: (id: number | string) => apiAuth.patch(`notifications/${id}/mark-as-read/`),
  markAllRead: () => apiAuth.post("notifications/mark-all-read/"),
  clearAll: () => apiAuth.delete("notifications/clear-all/"),
};


