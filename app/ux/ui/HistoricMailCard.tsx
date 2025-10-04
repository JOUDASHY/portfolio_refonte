"use client";

import Button from "./Button";
import { getRandomColor, getInitial } from "../../lib/avatarUtils";
import { formatEmailDate } from "../../lib/dateUtils";
import type { HistoricMail } from "../../types/backoffice/email";

interface HistoricMailCardProps {
  mail: HistoricMail;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (mail: HistoricMail) => void;
  t: (key: string) => string;
}

export default function HistoricMailCard({
  mail,
  isSelected,
  onSelect,
  onDelete,
  t
}: HistoricMailCardProps) {
  const profileColor = getRandomColor(mail.nom_entreprise);
  const initial = getInitial(mail.nom_entreprise);

  return (
    <div className="historic-mail-item bg-white/5 rounded-lg border border-white/20 p-4 hover:bg-white/10 transition-colors shadow-sm">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          className="checkbox mt-1 w-4 h-4 text-accent bg-white/10 border-white/30 rounded focus:ring-accent focus:ring-2"
          checked={isSelected}
          onChange={() => onSelect(mail.id)}
        />
        
        <div
          className="profile-photo-mail w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: profileColor }}
        >
          {initial}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3">
                <p className="text-foreground/90 text-sm leading-relaxed">
                        L&apos;email <span className="font-semibold text-accent">{mail.email_entreprise}</span>, 
                        destiné à l&apos;entreprise <span className="font-semibold text-foreground">{mail.nom_entreprise}</span>,
                  située à <span className="font-semibold text-foreground">{mail.lieu_entreprise}</span>, 
                  a été envoyé avec succès le <span className="font-semibold text-foreground">{formatEmailDate(mail.date_envoi, mail.heure_envoi)}</span>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                  <i className="fas fa-check-circle mr-1"></i>
                  {t("mailingHistory.status.sent")}
                </span>
                <span className="text-xs text-foreground/60">
                  ID: {mail.id}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-500/10"
                onClick={() => onDelete(mail)}
              >
                <i className="fas fa-trash mr-2"></i>
                {t("mailingHistory.actions.delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
