import React from 'react';

export default function CircleMeshBackground({
  children,
  variant = 'dark',
  intensity = 'subtle',
  animated = true,
}) {
  const opacityMap = {
    subtle: 0.14,
    medium: 0.22,
    bold: 0.32,
  };

  const particleOpacity = opacityMap[intensity];

  const palette =
    variant === 'dark'
      ? ['#FF6B2B', '#8B5CF6', '#FFFFFF', '#60A5FA']
      : ['#1E293B', '#7C3AED', '#F97316', '#0F172A'];

  const particles = [
    { left: '8%', top: '14%', size: 9, color: palette[0], group: 1 },
    { left: '18%', top: '72%', size: 12, color: palette[1], group: 2 },
    { left: '28%', top: '28%', size: 7, color: palette[2], group: 1 },
    { left: '38%', top: '64%', size: 10, color: palette[3], group: 3 },
    { left: '52%', top: '18%', size: 13, color: palette[1], group: 2 },
    { left: '60%', top: '58%', size: 8, color: palette[0], group: 3 },
    { left: '68%', top: '32%', size: 9, color: palette[2], group: 1 },
    { left: '78%', top: '76%', size: 11, color: palette[3], group: 2 },
    { left: '86%', top: '20%', size: 8, color: palette[0], group: 3 },
    { left: '92%', top: '62%', size: 7, color: palette[1], group: 1 },
    { left: '12%', top: '44%', size: 6, color: palette[3], group: 2 },
    { left: '44%', top: '82%', size: 8, color: palette[0], group: 3 },
    { left: '72%', top: '10%', size: 6, color: palette[1], group: 1 },
    { left: '96%', top: '38%', size: 7, color: palette[2], group: 2 },
  ];

  const child = React.Children.only(children);

  const injectedChild = React.isValidElement(child)
    ? React.cloneElement(child, {
        className: `${child.props.className || ''} relative isolate overflow-hidden`.trim(),
        children: (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {particles.map((particle, index) => (
                <span
                  key={index}
                  className={
                    animated
                      ? `circle-particle group-${particle.group} animate-group`
                      : 'circle-particle'
                  }
                  style={{
                    left: particle.left,
                    top: particle.top,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    opacity: particleOpacity,
                    boxShadow: `0 0 14px ${particle.color}22`,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">{child.props.children}</div>
          </>
        ),
      })
    : children;

  return (
    <>
      {injectedChild}

      <style jsx>{`
        .circle-particle {
          position: absolute;
          border-radius: 9999px;
          transform: translate3d(0, 0, 0);
          will-change: transform, opacity;
          filter: blur(0.3px);
        }

        .animate-group {
          animation-duration: 8s;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        }

        .group-1 {
          animation-name: converge-scatter-1;
        }

        .group-2 {
          animation-name: converge-scatter-2;
          animation-delay: 1.5s;
        }

        .group-3 {
          animation-name: converge-scatter-3;
          animation-delay: 3s;
        }

        @keyframes converge-scatter-1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(2px, -8px, 0) scale(0.95);
          }
          50% {
            transform: translate3d(-4px, 6px, 0) scale(1.02);
          }
          75% {
            transform: translate3d(3px, -3px, 0) scale(0.98);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes converge-scatter-2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(-3px, 6px, 0) scale(0.98);
          }
          50% {
            transform: translate3d(2px, -8px, 0) scale(1.03);
          }
          75% {
            transform: translate3d(-4px, 3px, 0) scale(0.97);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes converge-scatter-3 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(4px, 5px, 0) scale(0.96);
          }
          50% {
            transform: translate3d(-2px, -7px, 0) scale(1.04);
          }
          75% {
            transform: translate3d(2px, 4px, 0) scale(0.99);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-group {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
