import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ParticleClusterBackground({
  particleCount = 20,
  variant = 'dark',
  intensity = 'subtle',
}) {
  const [particles, setParticles] = useState([]);

  const palette = useMemo(
    () =>
      variant === 'dark'
        ? ['#FF6B2B', '#8B5CF6', '#60A5FA', '#FFFFFF']
        : ['#1E293B', '#7C3AED', '#F97316', '#0F172A'],
    [variant]
  );

  const opacityMap = {
    subtle: 0.5,
    medium: 0.65,
    bold: 0.8,
  };

  const particleOpacity = opacityMap[intensity];

  // Initialize particles with random properties
  useEffect(() => {
    const initialParticles = Array.from({ length: particleCount }).map((_, i) => {
      const clusterGroup = Math.floor(i / 3); // Group particles in sets of 3
      return {
        id: i,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        color: palette[i % palette.length],
        size: Math.random() * 3 + 3, // 3-6px
        duration: Math.random() * 3 + 3, // 3-6 seconds
        clusterGroup,
        clusterDelay: Math.random() * 2, // Random cluster trigger
        scatterForce: (Math.random() - 0.5) * 60, // Direction to scatter
      };
    });
    setParticles(initialParticles);
  }, [particleCount, palette]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <ParticleMotion key={particle.id} particle={particle} opacity={particleOpacity} />
      ))}
    </div>
  );
}

function ParticleMotion({ particle, opacity }) {
  // Calculate cluster center for this particle's group
  const getClusterTarget = (groupId) => {
    const targetX = 30 + (groupId % 3) * 30;
    const targetY = 40 + Math.floor(groupId / 3) * 30;
    return { x: targetX, y: targetY };
  };

  // Animation sequence for clustering and scattering
  const animationSequence = [
    // Free movement phase (2-3s)
    {
      x: particle.startX + (Math.random() - 0.5) * 30,
      y: particle.startY + (Math.random() - 0.5) * 30,
      transition: {
        duration: particle.duration * 0.6,
        ease: 'easeInOut',
      },
    },
    // Move toward cluster (0.8s)
    {
      x: getClusterTarget(particle.clusterGroup).x + (Math.random() - 0.5) * 15,
      y: getClusterTarget(particle.clusterGroup).y + (Math.random() - 0.5) * 15,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        delay: particle.clusterDelay,
      },
    },
    // Stay in cluster (0.5s)
    {
      transition: {
        duration: 0.5,
        ease: 'linear',
      },
    },
    // Scatter phase (1-2s)
    {
      x: particle.startX + particle.scatterForce,
      y: particle.startY + (Math.random() - 0.5) * 80,
      transition: {
        duration: 1.2,
        ease: 'easeInOut',
      },
    },
  ];

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        left: `${particle.startX}%`,
        top: `${particle.startY}%`,
        opacity: opacity,
        boxShadow: `0 0 12px ${particle.color}33`,
        filter: 'blur(0.3px)',
      }}
      animate={{
        x: [
          (Math.random() - 0.5) * 40,
          getClusterTarget(particle.clusterGroup).x * 1.5 + (Math.random() - 0.5) * 20,
          getClusterTarget(particle.clusterGroup).x * 1.5 + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 80,
        ],
        y: [
          (Math.random() - 0.5) * 40,
          getClusterTarget(particle.clusterGroup).y * 1.5 + (Math.random() - 0.5) * 20,
          getClusterTarget(particle.clusterGroup).y * 1.5 + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 100,
        ],
        scale: [1, 1, 1.15, 1],
      }}
      transition={{
        duration: particle.duration + 2,
        times: [0, 0.4, 0.65, 1],
        repeat: Infinity,
        delay: Math.random() * 0.5,
      }}
    />
  );
}
