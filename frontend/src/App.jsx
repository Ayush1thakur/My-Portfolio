import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BackendStatusCard from './components/BackendStatusCard';
import ProjectsSection from './components/ProjectsSection';
import NeonGuideCard from './components/NeonGuideCard';
import Footer from './components/Footer';
import { checkBackendHealth, fetchProjects } from './services/api';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const loadHealth = async () => {
    setLoadingHealth(true);
    const res = await checkBackendHealth();
    if (res.ok) {
      setHealthData(res.data);
      setLatency(res.duration);
    } else {
      setHealthData({
        success: false,
        message: 'Could not connect to Spring Boot backend',
        data: { status: 'DOWN', error: res.error }
      });
      setLatency(res.duration);
    }
    setLoadingHealth(false);
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetchProjects();
      if (res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadHealth();
    loadProjects();
  }, []);

  const isConnected = healthData?.data?.status === 'UP';

  return (
    <div className="portfolio-app">
      <Navbar onPingBackend={loadHealth} isConnected={isConnected} />
      <main>
        <Hero onPingClick={loadHealth} pingLoading={loadingHealth} />
        <BackendStatusCard
          healthData={healthData}
          loading={loadingHealth}
          onRefresh={loadHealth}
          latency={latency}
        />
        <ProjectsSection
          projects={projects}
          onProjectCreated={loadProjects}
        />
        <NeonGuideCard />
      </main>
      <Footer />
    </div>
  );
}
