// Maps the icon name stored on each RoadmapPillar (from the backend) to an
// actual lucide-react component. Keeping this in one place means the
// backend can add a new pillar with any icon name from this list without a
// frontend code change.
import {
  Compass,
  ShieldCheck,
  Flame,
  Briefcase,
  Users,
  MessagesSquare,
  Sparkles,
} from 'lucide-react';

export const pillarIconMap = {
  Compass,
  ShieldCheck,
  Flame,
  Briefcase,
  Users,
  MessagesSquare,
  Sparkles,
};

export function getPillarIcon(name) {
  return pillarIconMap[name] || Compass;
}
