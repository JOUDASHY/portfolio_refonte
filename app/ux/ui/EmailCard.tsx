"use client";

import Button from "./Button";
import { getRandomColor, getInitial } from "../../lib/avatarUtils";
import { formatSimpleDate } from "../../lib/dateUtils";
import type { Email } from "../../types/backoffice/email";

interface EmailCardProps {
  email: Email;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onReply: (email: Email) => void;
  onDelete: (email: Email) => void;
  showResponses?: boolean;
  t: (key: string) => string;
}

export default function EmailCard({
  email,
  isSelected,
  onSelect,
  onReply,
  onDelete,
  showResponses = true,
  t
}: EmailCardProps) {
  const profileColor = getRandomColor(email.name);
  const initial = getInitial(email.name);
  const latestResponse = showResponses && email.responses.length > 0 
    ? email.responses[email.responses.length - 1] 
    : null;

  const getEmailStatus = (email: Email): "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed" => {
    if (email.responses.length === 0) return "sent";
    if (email.responses.some(r => r.response.toLowerCase().includes("erreur") || r.response.toLowerCase().includes("error"))) return "failed";
    if (email.responses.some(r => r.response.toLowerCase().includes("bounce") || r.response.toLowerCase().includes("rejeté"))) return "bounced";
    if (email.responses.some(r => r.response.toLowerCase().includes("click") || r.response.toLowerCase().includes("cliqué"))) return "clicked";
    if (email.responses.some(r => r.response.toLowerCase().includes("open") || r.response.toLowerCase().includes("ouvert"))) return "opened";
    return "delivered";
  };

  const statusColors = {
    sent: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    opened: "bg-purple-100 text-purple-800",
    clicked: "bg-orange-100 text-orange-800",
    bounced: "bg-red-100 text-red-800",
    failed: "bg-gray-100 text-gray-800"
  };

  const statusLabels = {
    sent: t("mailing.status.sent"),
    delivered: t("mailing.status.delivered"),
    opened: t("mailing.status.opened"),
    clicked: t("mailing.status.clicked"),
    bounced: t("mailing.status.bounced"),
    failed: t("mailing.status.failed")
  };

  const emailStatus = getEmailStatus(email);

  return (
    <div className="email-item bg-white/5 dark:bg-white/5 bg-white rounded-lg border border-white/20 dark:border-white/20 border-black/20 p-4 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          className="checkbox mt-1 w-4 h-4 text-accent bg-white/10 dark:bg-white/10 bg-gray-100 border-white/30 dark:border-white/30 border-gray-300 rounded focus:ring-accent focus:ring-2"
          checked={isSelected}
          onChange={() => onSelect(email.id)}
        />
        
        <div
          className="profile-photo-email w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: profileColor }}
        >
          {initial}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <b className="text-foreground text-lg">{email.name}</b>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[emailStatus]}`}>
                  {statusLabels[emailStatus]}
                </span>
              </div>
              <p className="text-foreground/80 text-sm mb-2">{email.email}</p>
              <p className="text-foreground/90 mb-3 leading-relaxed">
                {email.message.length > 100 ? `${email.message.substring(0, 100)}...` : email.message}
              </p>
              <small className="text-foreground/60 text-xs">
                {t("mailing.receivedAt")} : {formatSimpleDate(email.date, email.heure)}
              </small>
              
              {latestResponse && showResponses && (
                <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-accent text-sm">{t("mailing.latestResponse")}:</strong>
                    <span className="text-xs text-foreground/60">
                      {formatSimpleDate(latestResponse.date, latestResponse.heure)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">{latestResponse.response}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                className="px-3 py-2 text-sm text-accent hover:bg-accent/10"
                onClick={() => onReply(email)}
              >
                <i className="fas fa-reply mr-2"></i>
                {t("mailing.actions.reply")}
              </Button>
              <Button 
                variant="ghost" 
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-500/10"
                onClick={() => onDelete(email)}
              >
                <i className="fas fa-trash mr-2"></i>
                {t("mailing.actions.delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
