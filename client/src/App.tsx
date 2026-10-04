
import { useEffect, useState } from "react";
import axios from "axios";
import type { Server, ServerStatsResponse } from "./types";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import OverviewCards from "./components/OverviewCards";
import LoadBalancerCard from "./components/LoadBalancerCard";
import BackendServers from "./components/BackendServers";
import TrafficDistribution from "./components/TrafficDistribution";
import LoadingScreen from "./components/LoadingScreen";

import "./App.css";

function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get<ServerStatsResponse[]>("/api/stats");

        setServers(
          response.data.map(({ requests, successes, failures, ...server }) => ({
            ...server,
            requestCount: requests,
            successCount: successes,
            failureCount: failures,
          })),
        );
        setLastUpdated(new Date());
        setApiError(false);
      } catch (error) {
        console.error("Failed to fetch server stats:", error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 3000);

    return () => clearInterval(interval);
  }, []);

  const healthyServers = servers.filter(
    (server) => server.healthy
  ).length;

  const unhealthyServers = servers.filter(
    (server) => !server.healthy
  ).length;

  const totalRequests = servers.reduce(
    (total, server) => total + server.requestCount,
    0
  );

  const totalSuccesses = servers.reduce(
    (total, server) => total + server.successCount,
    0
  );

  const totalFailures = servers.reduce(
    (total, server) => total + server.failureCount,
    0
  );

  const successRate =
    totalRequests > 0
      ? ((totalSuccesses / totalRequests) * 100).toFixed(1)
      : "0.0";

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <DashboardHeader lastUpdated={lastUpdated} />

        {apiError && (
          <div className="api-error">
            Unable to connect to the load balancer.
            Retrying automatically...
          </div>
        )}

        <OverviewCards
          totalRequests={totalRequests}
          healthyServers={healthyServers}
          totalServers={servers.length}
          unhealthyServers={unhealthyServers}
          totalFailures={totalFailures}
          totalSuccesses={totalSuccesses}
          successRate={successRate}
        />

        <LoadBalancerCard />

        <BackendServers servers={servers} />

        <TrafficDistribution
          servers={servers}
          totalRequests={totalRequests}
        />
      </main>
    </div>
  );
}

export default App;
