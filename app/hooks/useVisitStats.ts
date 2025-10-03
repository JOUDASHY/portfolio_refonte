"use client";

import { useEffect, useState } from "react";
import { visitService } from "../services/backoffice/visitService";
import type { MonthlyVisit } from "../types/backoffice/visit";

interface VisitStatsData {
  totalVisits: number;
  monthlyStats: MonthlyVisit[];
}

interface UseVisitStatsReturn {
  data: VisitStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les statistiques de visites
 */
export function useVisitStats(): UseVisitStatsReturn {
  const [data, setData] = useState<VisitStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [totalResponse, monthlyResponse] = await Promise.all([
        visitService.total(),
        visitService.monthlyStats(),
      ]);

      setData({
        totalVisits: totalResponse.data.total_visits || 0,
        monthlyStats: Array.isArray(monthlyResponse.data) ? monthlyResponse.data : [],
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      console.warn("Erreur useVisitStats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}
