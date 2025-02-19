import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HealthData {
  steps?: number;
  heartRate?: number;
  sleep?: string; // Adjust this type based on the actual format of sleep data
}

interface HealthDashboardProps {
  userId: string;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ userId }) => {
  const [healthData, setHealthData] = useState<HealthData>({});

  useEffect(() => {
    axios
      .get(`/api/user/${userId}/health-data`)
      .then((response) => setHealthData(response.data))
      .catch((error) => console.error('Error fetching health data:', error));
  }, [userId]);

  return (
    <div>
      <h2>Health Dashboard</h2>
      <p>Steps: {healthData.steps ?? 'Loading...'}</p>
      <p>Heart Rate: {healthData.heartRate ?? 'Loading...'}</p>
      <p>Sleep: {healthData.sleep ?? 'Loading...'}</p>
    </div>
  );
};


