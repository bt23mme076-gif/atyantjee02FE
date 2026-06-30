import { Clock3, GraduationCap, HeartHandshake, School2, ShieldCheck, Sparkles, Users2 } from 'lucide-react';

const _override = (() => {
  try { return JSON.parse(localStorage.getItem('siteContentOverride') || 'null'); } catch { return null; }
})();
export const COLLEGES_BY_TYPE = {
  IIT: [
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "IIT Guwahati",
    "IIT Hyderabad",
    "IIT BHU Varanasi",
    "IIT (ISM) Dhanbad",
    "IIT Indore",
    "IIT Ropar",
    "IIT Mandi",
    "IIT Gandhinagar",
    "IIT Patna",
    "IIT Bhubaneswar",
    "IIT Jodhpur",
    "IIT Tirupati",
    "IIT Bhilai",
    "IIT Dharwad",
    "IIT Goa",
    "IIT Jammu",
    "IIT Palakkad"
  ],
  NIT: [
    "NIT Tiruchirappalli",
    "NIT Surathkal",
    "NIT Rourkela",
    "NIT Warangal",
    "NIT Calicut",
    "NIT Allahabad (MNNIT Allahabad)",
    "VNIT Nagpur",
    "MALAVIYA NIT Jaipur (MNIT Jaipur)",
    "MANIT Bhopal",
    "NIT Kurukshetra",
    "NIT Jamshedpur",
    "NIT Durgapur",
    "NIT Silchar",
    "NIT Patna",
    "NIT Raipur",
    "NIT Srinagar",
    "NIT Jalandhar",
    "NIT Hamirpur",
    "NIT Goa",
    "NIT Agartala",
    "NIT Meghalaya",
    "NIT Manipur",
    "NIT Sikkim",
    "NIT Uttarakhand",
    "NIT Mizoram",
    "NIT Nagaland",
    "NIT Arunachal Pradesh",
    "NIT Puducherry",
    "NIT Andhra Pradesh", // Fixed location tag typo
    "SVNIT Surat",
    "NIT Delhi",
    "IIEST Shibpur" // Added from expected list (JoSAA NIT-Plus cadre)
  ],
  IIIT: [
    "IIIT Hyderabad",
    "IIIT Bangalore",
    "IIIT Delhi",
    "IIIT Allahabad",
    "ABV-IIITM Gwalior",
    "IIITDM Jabalpur",
    "IIITDM Kancheepuram",
    "IIIT Kancheepuram", // Added missing institute
    "IIIT Pune",
    "IIIT Nagpur",
    "IIIT Lucknow",
    "IIIT Sri City",
    "IIIT Vadodara",
    "IIIT Kota",
    "IIIT Guwahati",
    "IIIT Kalyani",
    "IIIT Kottayam",
    "IIIT Dharwad",
    "IIIT Bhopal",
    "IIIT Bhagalpur",
    "IIIT Chittoor",
    "IIIT Manipur",
    "IIIT Ranchi",
    "IIIT Raichur",
    "IIIT Sonepat",
    "IIIT Surat",
    "IIIT Una",
    "IIITV-ICD Gandhinagar",
    "IIITDM Kurnool",
    "IIIT Agartala",
    "IIIT Naya Raipur",
    "IIIT Bhubaneswar"
  ],
  "STATE GOV.": [
    "DTU Delhi", 
    "NSUT Delhi", 
    "Jadavpur University", 
    "COEP Tech Pune", 
    "VJTI Mumbai", 
    "ICT Mumbai", 
    "Anna University / CEG Guindy", 
    "HBTU Kanpur", 
    "IET Lucknow", 
    "BIT Sindri", 
    "SGSITS Indore", 
    "JEC Jabalpur",
    "Andhra University College of Engineering", // Added missing
    "Osmania University College of Engineering",  // Added missing
    "JNTU Hyderabad"                             // Added missing
  ],
  PRIVATE: [
    "BITS Pilani", "BITS Goa", "BITS Hyderabad", "VIT Vellore", "MIT Manipal", 
    "Thapar University", "RVCE Bangalore", "BMSCE Bangalore", "MSRIT Bangalore", 
    "Amrita Vishwa Vidyapeetham", "SRM University", "DA-IICT", "LNMIIT Jaipur"
  ],
  OTHERS: [
    "PEC Chandigarh", 
    "BIT Mesra", 
    "IIST Thiruvananthapuram", 
    "RGIPT Jais", 
    "IEM Kolkata", 
    "Nirma University", 
    "KIIT Bhubaneswar",
    "SPA Delhi",               // Added missing CFTI
    "University of Hyderabad",  // Added missing Central Uni
    "Tezpur University",       // Added missing Central Uni
    "SLIET Longowal",          // Added missing CFTI
    "Other Government Colleges" // Added safe fallback option
  ]
};

export const POPULAR_LANGUAGES = ["English", "Hindi", "Hinglish", "Marathi", "Telugu", "Tamil", "Bengali", "Gujarati", "Kannada"];

export const DEPARTMENTS = [
  "Aerospace / Aeronautical Engineering",
  "Agricultural Engineering",
  "Architecture",
  "Biology / Life Sciences",
  "Biotechnology",
  "Ceramic Engineering",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science & Engineering (AI/ML)",
  "Computer Science & Engineering (Cybersecurity)",
  "Computer Science & Engineering (CSE)",
  "Computer Science & Engineering (Data Science)",
  "Earth & Environmental Science",
  "Electrical & Electronics Engineering (EEE)",
  "Electrical Engineering (EE)",
  "Electronics & Communication Engineering (ECE)",
  "Engineering Mathematics & Computing",
  "Engineering Physics",
  "Environmental Engineering",
  "Information Technology (IT)",
  "Instrumentation & Control Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Metallurgical & Materials Engineering",
  "Mining Engineering",
  "Ocean / Marine Engineering",
  "Physics",
  "Production & Industrial Engineering",
  "Rubber & Plastics Technology",
  "Statistics",
  "Textile Engineering"
];
export const ALL_INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Jammu and Kashmir", "Puducherry"
];

// ─── Live Counselling Schedule ──────────────────────────────────────────────
// Each entry is a real-world counselling window. Dates are inclusive.
// To update for next year, just edit the start/end dates below —
// the "live now" banner on the homepage will pick it up automatically.
export const examSchedule = _override?.examSchedule ?? [
  {
    id: 'mhtcet',
    label: 'MHT-CET',
    fullName: 'MHT-CET',
    start: '2026-06-15',
    end: '2026-07-25',
    anchor: '/programs#mhtcet',
    colorTheme: 'orange',
  },
  {
    id: 'josaa',
    label: 'JoSAA / CSAB',
    fullName: 'CSAB',
    start: '2026-06-05',
    end: '2026-07-20',
    anchor: '/programs#josaa',
    colorTheme: 'blue',
  },
  {
    id: 'all-india',
    label: 'All India',
    fullName: 'All India',
    start: '2026-06-10',
    end: '2026-07-10',
    anchor: '/programs#othercounselling',
    colorTheme: 'green',
  },
];

export const navLinks = _override?.navLinks ?? [
  { label: 'How it Works', href: '/#how-it-works' }, 
  { label: 'Pricing', href: '/#pricing' },           
  { label: 'Success Stories', href: '/#stories' },   
  { label: 'FAQ', href: '/#faq' },                   
];

export const heroTrustBadges = _override?.heroTrustBadges ?? ['12,000+ Students Guided', '100+ Colleges Covered', '4.9 Rating'];

export const heroProfilePoints = _override?.heroProfilePoints ?? [
  'Rank 80k - 3 lakh',
  'Tier 2 / Tier 3 city',
  'Parent-influenced decision',
];

export const heroDecisionRows = _override?.heroDecisionRows ?? [
  { label: 'College fit', value: 'Strong match' },
  { label: 'Branch pressure', value: 'Resolved' },
  { label: 'Placement outlook', value: 'Clear' },
  { label: 'Regret risk', value: 'Reduced' },
];

export const painPoints = _override?.painPoints ?? [
  {
    title: 'Choose college blindly after rank',
    icon: GraduationCap,
    description: 'A rank alone does not tell you whether the college, branch, city, or peer group fits your future.',
  },
  {
    title: 'Take wrong branch due to pressure',
    icon: HeartHandshake,
    description: 'Family pressure, coach advice, and fear can push students into a branch they never wanted.',
  },
  {
    title: 'Lose 4 years fixing wrong decisions',
    icon: Clock3,
    description: 'A confusing admission choice can turn into a long, expensive detour in college life.',
  },
];

export const pillars = [
  {
    title: 'Real Seniors',
    description: 'Talk to students from the colleges you are considering and hear the reality directly.',
    icon: Users2,
  },
  {
    title: 'Real Placement Truth',
    description: 'Understand placements, branch reality, culture, opportunities, and what actually happens after joining.',
    icon: ShieldCheck,
  },
  {
    title: 'Better Rank Decisions',
    description: 'Get guidance based on your rank, budget, goals, and what fits your next 4 years.',
    icon: Sparkles,
  },
  {
    title: 'Parent-Friendly Guidance',
    description: 'Make decisions your parents can trust because they are practical, clear, and future-safe.',
    icon: School2,
  },
];

export const pricingPlans = _override?.pricingPlans ?? [
  {
    title: 'Complete Round Support',
    price: '999',
    originalPrice: '1,999',
    discount: '50% OFF',
    discountLabel: 'Best Choice for Most',
    bestFor: 'Full JoSAA + CSAB support till final allotment. Peace of mind during every counselling round.',
    features: [
      'Complete CSAB support',
      'Dedicated mentor throughout',
      'Priority WhatsApp support',
      'Backup planning if allotment changes',
      'Support till final rounds',
    ],
    bonusLabel: '🎁 Premium Advantage Pack Included:',
    bonus: [
      'Resume Templates',
      'First-Year Career Strategy',
      'High-Growth Domains (2026+)',
      'Personal Branding Basics',
      'Networking Systems',
      'Off-Campus Internship Roadmap',
    ],
    cta: 'Get Full Support →',
    highlighted: true,
    badge: '⭐ MOST POPULAR',
    colorTheme: 'navy-glow',
    bottomText: 'Best for zero stress & better decisions.',
  },
  {
    title: 'Ultimate Peace of Mind',
    price: '1,999',
    originalPrice: '2,999',
    discount: '33% OFF',
    discountLabel: '1-on-1 Premium',
    bestFor: 'Highest level of personal support. 1-on-1 premium guidance from start to finish.',
    features: [
      'Everything in ₹999 package',
      'Personal 1-on-1 mentor',
      'Personalized preference review',
      'Final decision support calls',
      'Unlimited WhatsApp access',
      'Post-allotment transition guidance',
    ],
    bonusLabel: '🎁 Bonus Included:',
    bonus: [
      'Interview & Aptitude Guide',
      'Extra mentor sessions (if needed)',
      'Personal branding roadmap',
      'College transition support',
    ],
    cta: 'Go Premium →',
    highlighted: true,
    badge: '⭐ MOST PERSONALIZED',
    valueCallout: '💎 VIP SUPPORT',
    colorTheme: 'purple',
    bottomText: 'Personal Mentor Till Final Allotment',
  },
];

export const admissionPrograms = _override?.admissionPrograms ?? [
  {
    id: 'college-clarity',
    title: 'College Clarity',
    badge: 'LIMITED TIME OFFER',
    badgeFloating: false,
    discount: '33% OFF',
    price: '999',
    oldPrice: '1,500',
    shortDesc: 'Quick expert clarity before your CAP rounds.',
    bestFor: 'Students who want quick clarity before CAP rounds.',
    features: [
      'Personalized Strategy Session',
      'Rank, College & Branch Analysis',
      'Personalized College Shortlist',
      'CAP Strategy Guidance',
      'WhatsApp Support',
    ],
    bonusLabel: 'Bonus Resources',
    bonusItems: [
      'Top Maharashtra Colleges Guide',
      'Branch Scope Guide',
      'Common Admission Mistakes',
    ],
    cta: 'Get Clarity →',
    footerNote: 'Quick clarity before your CAP round.',
    colorTheme: 'default',
    isPaymentPlan: true,
    planTitle: 'College Clarity',
  },
  {
    id: 'admission-success',
    title: 'Admission Success',
    badge: '⭐ MOST POPULAR',
    badgeFloating: true,
    subtitle: 'Chosen by Students & Parents',
    shortDesc: 'Complete support from CAP rounds till final admission.',
    discount: '43% OFF',
    price: '1,999',
    oldPrice: '3,500',
    bestFor: 'Students who want support till final admission.',
    valueCallout: '🏆 Best Value',
    comparisonHint: 'Everything in College Clarity + Complete Admission Support',
    features: [
      'Everything in College Clarity',
      'Dedicated Admission Mentor',
      'Complete CAP & Spot Round Support',
      'Choice Filling Review',
      'Unlimited WhatsApp Support',
      'Final Admission Guidance',
    ],
    bonusLabel: 'Career Advantage Pack',
    bonusItems: [
      'Resume Templates',
      'LinkedIn Starter Guide',
      'Internship Roadmap',
      'Placement Preparation Roadmap',
      'Career Opportunities by Branch',
    ],
    cta: 'Get Full Support →',
    footerNote: 'Support till admission. Guidance beyond admission.',
    colorTheme: 'center',
    isPaymentPlan: true,
    planTitle: 'Admission Success',
  },
  {
    id: 'admission-career-growth',
    title: 'Admission + Career Growth',
    badge: '👑 PREMIUM',
    badgeFloating: true,
    shortDesc: 'Full handholding from admission to career success.',
    discount: '20% OFF',
    price: '4,999',
    oldPrice: '7,000',
    bestFor: 'Students & parents who want complete handholding.',
    features: [
      'Everything in Admission Success',
      'Personal 1-on-1 Mentor',
      'Parent Consultation Session',
      'Priority Support',
      'College Joining Guidance',
    ],
    bonusLabel: 'Premium Career Accelerator',
    bonusItems: [
      'Resume Review & Optimization',
      'LinkedIn Profile Review',
      'Personalized Career Roadmap',
      'Placement Strategy',
      'Industry & Domain Selection Guidance',
    ],
    cta: 'Go Premium →',
    footerNote: 'From MHT-CET Admission to Career Success.',
    colorTheme: 'premium',
    isPaymentPlan: true,
    planTitle: 'Admission + Career Growth',
  },
];

export const testimonials = _override?.testimonials ?? [
  { name: 'Priya Sharma', city: 'Nagpur', quote: 'I had no idea whether to pick CSE at NIT Raipur or ECE at NIT Warangal. One session gave me placement data I could not find anywhere online. Made the right call.', stars: 5 },
  { name: 'Arjun Mehta', city: 'Indore', quote: 'My parents were pushing for a big name college over branch. After talking to a senior from BITS Pilani, we completely changed our strategy. Best decision ever.', stars: 4 },
  { name: 'Kavya Reddy', city: 'Bhopal', quote: 'I was about to join a private college out of panic. The session showed me I still had good options left in counselling. Saved me 4 years of regret.', stars: 5 },
  { name: 'Rahul Tiwari', city: 'Patna', quote: 'Got clarity on which NIT branch actually has placements vs which ones just look good on paper. Nobody else gave me this honest breakdown.', stars: 5 },
  { name: 'Ananya Singh', city: 'Lucknow', quote: 'My JEE rank was average and I felt lost. After the session I had a clear list of 6 colleges to target in JOSAA. Got into my first choice.', stars: 4 },
  { name: 'Vikram Joshi', city: 'Surat', quote: 'The senior I talked to had the exact same rank as me two years ago. Hearing what worked for them was more useful than any YouTube video I watched.', stars: 5 },
  { name: 'Sneha Kulkarni', city: 'Pune', quote: 'I was confused between IIIT Pune and a lower branch in VNIT. The mentorship session helped me compare future opportunities instead of just college tags.', stars: 5 },
  { name: 'Aditya Verma', city: 'Kanpur', quote: 'Every counselling video online was giving different advice. Here I finally got a realistic roadmap based on my actual percentile and category.', stars: 5 },
  
];

export const testimonialVideos = _override?.testimonialVideos ?? [
  { src: '/m1.mp4', name: 'Student Story', city: 'Atyant Mentee', poster: '' },
  { src: '/m2.mp4', name: 'Student Story', city: 'Atyant Mentee', poster: '' },
  { src: '/m3.mp4', name: 'Student Story', city: 'Atyant Mentee', poster: '' },
];

export const faqCategories = _override?.faqCategories ?? [
  {
    category: 'What this actually is',
    items: [
      {
        question: "What does Atyant's JEE counselling support include?",
        answer: "1:1 sessions with current NIT/IIT/IIIT students who help you understand JoSAA/CSAB rounds, fill your choice list strategically, decode branch vs. college trade-offs, and avoid the mistakes most aspirants make in the 5-day window."
      },
      {
        question: "Is this the same as JoSAA counselling?",
        answer: "No. JoSAA is the official allotment process. We help you prepare for it — figuring out which colleges and branches to fill, in what order, based on your rank, category, home state, and goals."
      },
      {
        question: "Do you actually fill the JoSAA form for me?",
        answer: "No. You fill it yourself on the official JoSAA portal. We help you decide what to fill — the strategy, not the data entry."
      }
    ]
  },
  {
    category: 'Who needs this',
    items: [
      {
        question: "My rank is X — do I need counselling support?",
        answer: "If you're confident about your top 3 choices, maybe not. If you're staring at 80+ possible college-branch combinations and don't know how to order them, yes. Most aspirants underestimate how much one wrong choice order costs them."
      },
      {
        question: "I'm in OBC/SC/ST/EWS category. Can you help with category-specific counselling?",
        answer: "Yes. Our mentors include students from every category who went through the exact same counselling logic. Filter mentors by category match."
      },
      {
        question: "I'm a girl candidate eligible for female supernumerary seats. Does that change strategy?",
        answer: "Yes, significantly. We have mentors who used the female pool to get into better colleges than their rank suggested. Book one before locking your choice list."
      },
      {
        question: "My rank is low. Should I even bother with JoSAA or go straight to private colleges?",
        answer: "Talk to a mentor first. Many aspirants give up on JoSAA too early and miss CSAB special rounds where good colleges open up. Others waste weeks on JoSAA when their rank made it impossible from day one."
      }
    ]
  },
  {
    category: 'The actual decisions',
    items: [
      {
        question: "How do I decide between a higher-ranked branch at a lower NIT vs. a lower-ranked branch at a top NIT?",
        answer: "This is the single most asked question in JEE counselling. There's no formula. Talk to mentors from both paths — they'll tell you what placements, peer group, and life actually looked like."
      },
      {
        question: "Is CSE everywhere worth it, or should I take core branches at better NITs?",
        answer: "The honest answer changes every year based on placement trends. Get a current student's view, not a 2019 Quora answer."
      },
      {
        question: "Should I take a branch I don't want just to get into a top NIT, hoping to switch later?",
        answer: "Branch change rules vary by college and are getting harder every year. Don't bet on it without talking to someone who tried."
      },
      {
        question: "NIT vs. IIIT vs. BITS vs. state government college — how do I compare?",
        answer: "Each has different placement realities, fee structures, and campus life. We have mentors from all four — book whichever combination matches your shortlist."
      },
      {
        question: "What's the difference between JoSAA rounds, CSAB special, and state counselling? Should I do all three?",
        answer: "Yes, usually. But the strategy for each is different. Mentors walk you through the timeline and how to keep options open across all three."
      }
    ]
  }
];

export const howItWorksSteps = _override?.howItWorksSteps ?? [
  { step: '1', title: 'Share Details', text: 'Tell us your rank + target colleges.' },
  { step: '2', title: 'Get Matched', text: 'Get matched with a verified mentor from that exact college.' },
  { step: '3', title: 'Book Session', text: 'Book a session. Fill your choices right.' },
];

export const freeGroupBullets = _override?.freeGroupBullets ?? [
  'College updates',
  'Cutoff alerts',
  'Mistakes to avoid',
  'Senior Q&A',
];

export const footerLinks = _override?.footerLinks ?? [
  { label: 'Instagram', href: 'https://www.instagram.com/askatyant.in/' },
  { label: 'WhatsApp', href: 'https://wa.me/919579040183', title: 'All of you can join Atyant community' },
  { label: 'Contact', href: '#', title: 'Atyant Support - 919579040183' },
  { label: 'Privacy Policy', href: '#' },
];