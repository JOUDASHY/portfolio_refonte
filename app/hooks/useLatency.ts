import { useState, useEffect } from "react";

export const useLatency = (intervalMs: number = 5000) => {
  const [latency, setLatency] = useState<number | null>(null);

  const pingServer = (): Promise<number | null> =>
    new Promise(resolve => {
      const img = new Image();
      const start = performance.now();

      img.onload = () => {
        const duration = Math.round(performance.now() - start);
        resolve(duration);
      };

      img.onerror = () => {
        console.error('Ping failed');
        resolve(null);
      };

      // Utilise le logo du portfolio comme image de test
      img.src = `/logo_nil.png?cache=${Date.now()}`;
    });

  useEffect(() => {
    // Premier ping
    pingServer().then(setLatency);

    // Re-ping à intervalles réguliers
    const id = setInterval(() => {
      pingServer().then(setLatency);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return latency;
};
