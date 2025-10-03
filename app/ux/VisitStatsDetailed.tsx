"use client";

import { useVisitStats } from "../hooks/useVisitStats";

interface VisitStatsDetailedProps {
  className?: string;
}

export default function VisitStatsDetailed({ className = "" }: VisitStatsDetailedProps) {
  const { data, loading, error } = useVisitStats();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const currentMonth = data.monthlyStats[data.monthlyStats.length - 1];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <svg 
          className="h-4 w-4 text-accent" 
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
        <span className="font-medium">
          {data.totalVisits.toLocaleString()} visites totales
        </span>
      </div>
      
      {currentMonth && (
        <div className="text-sm text-foreground/70">
          Ce mois: {currentMonth.count.toLocaleString()} visites
        </div>
      )}
    </div>
  );
}
