"use client";

import { useEffect, useState } from "react";
import { visitService } from "../services/backoffice/visitService";

interface VisitStatsProps {
  className?: string;
  showLabel?: boolean;
}

export default function VisitStats({ className = "", showLabel = true }: VisitStatsProps) {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await visitService.total();
        setTotalVisits(data.total_visits || 0);
      } catch (error) {
        console.warn("Erreur lors du chargement des statistiques de visites:", error);
        // En cas d'erreur, on ne montre rien plutôt que d'afficher une erreur
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || totalVisits === null) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 text-sm text-foreground/70 ${className}`}>
      <svg 
        className="h-4 w-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      {showLabel && <span>Visites:</span>}
      <span className="font-medium text-foreground">
        {totalVisits.toLocaleString()}
      </span>
    </div>
  );
}
