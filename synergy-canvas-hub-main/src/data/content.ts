import {
  Users,
  Building2,
  Code2,
  Smartphone,
  Cloud,
  Brain,
  type LucideIcon,
} from "lucide-react";

export interface ServiceItem {
  title: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
  items: string[];
}

export const coreServices: ServiceItem[] = [
  {
    title: "Staffing Solutions",
    icon: Users,
    gradient: "gradient-primary",
    description: "Build high-performing teams with the right people, fast.",
    items: [
      "Executive Recruitment",
      "Permanent Staffing",
      "Temporary Staffing",
      "Campus Hiring",
      "Talent Acquisition",
      "Manpower Consultancy",
    ],
  },
  {
    title: "IT Outsourcing",
    icon: Building2,
    gradient: "gradient-vibrant",
    description: "Dedicated teams and managed services that scale with you.",
    items: [
      "Dedicated Teams",
      "Managed Services",
      "Infrastructure Support",
      "Application Support",
    ],
  },
  {
    title: "Software Development",
    icon: Code2,
    gradient: "gradient-emerald",
    description: "Custom, enterprise-grade software built to last.",
    items: [
      "Custom Software",
      "Enterprise Applications",
      "API Integration",
      "Software Modernization",
    ],
  },
  {
    title: "Web & Mobile Development",
    icon: Smartphone,
    gradient: "gradient-sunset",
    description: "Beautiful, responsive experiences across every device.",
    items: ["Responsive Websites", "Android Apps", "iOS Apps", "UI/UX Design"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    gradient: "gradient-primary",
    description: "Migrate, automate and operate cloud at enterprise scale.",
    items: [
      "Cloud Migration",
      "CI/CD",
      "Infrastructure Automation",
      "Monitoring",
    ],
  },
  {
    title: "AI & Data Analytics",
    icon: Brain,
    gradient: "gradient-vibrant",
    description: "Turn data into intelligent, measurable business outcomes.",
    items: [
      "Machine Learning",
      "Predictive Analytics",
      "BI Dashboards",
      "Data Visualization",
    ],
  },
];

export const stats = [
  { value: 80, suffix: "+", label: "Corporate Clients" },
  { value: 30, suffix: "K+", label: "Talent Network" },
  { value: 100, suffix: "%", label: "Quality Commitment" },
  { value: 12, suffix: "+", label: "Years of Excellence" },
];

export const approachSteps = [
  {
    step: "01",
    title: "Understand Business Goals",
    description:
      "We start by deeply understanding your objectives, challenges and the outcomes that matter most.",
  },
  {
    step: "02",
    title: "Design Workforce & Technology Strategy",
    description:
      "We craft a tailored staffing and technology roadmap aligned with your long-term vision.",
  },
  {
    step: "03",
    title: "Implement Scalable Solutions",
    description:
      "Our experts execute with precision — building teams and systems engineered to scale.",
  },
  {
    step: "04",
    title: "Measure Success & Optimize",
    description:
      "We track measurable KPIs and continuously optimize for sustained business impact.",
  },
];

export const whyChooseUs = [
  {
    title: "Industry Expertise",
    description:
      "Decades of combined experience across staffing, software and cloud delivery.",
  },
  {
    title: "Quality Delivery",
    description:
      "Rigorous standards and 100% commitment to quality on every engagement.",
  },
  {
    title: "Scalable Solutions",
    description:
      "Flexible engagement models that grow with your business needs.",
  },
  {
    title: "Dedicated Support",
    description: "Responsive, partnership-driven support at every step.",
  },
  {
    title: "Innovation Driven",
    description:
      "AI, cloud and modern engineering practices baked into everything we build.",
  },
  {
    title: "Long-Term Partnerships",
    description:
      "We invest in lasting relationships and measurable shared success.",
  },
];

export const testimonials = [
  {
    name: "Rachel Morgan",
    role: "VP of Engineering, NovaPay",
    quote:
      "SNN Technologies scaled our engineering team by 40% in a single quarter without compromising on quality. A true partner.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "CTO, Brightwave Systems",
    quote:
      "Their cloud migration team delivered ahead of schedule and under budget. The expertise was world-class.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Head of HR, Meridian Group",
    quote:
      "The staffing process was seamless. They understood our culture and matched us with exceptional talent.",
    rating: 5,
  },
  {
    name: "Marcus Lee",
    role: "COO, Apex Logistics",
    quote:
      "Our custom enterprise platform transformed operations. SNN's developers are genuinely best-in-class.",
    rating: 5,
  },
  {
    name: "Sofia Alvarez",
    role: "Director of Data, FinCore",
    quote:
      "Their AI and analytics team unlocked insights we didn't know existed. ROI was visible within months.",
    rating: 5,
  },
  {
    name: "James Whitfield",
    role: "Founder, Stratus Cloud",
    quote:
      "Reliable, innovative and deeply professional. SNN Technologies has become an extension of our own team.",
    rating: 5,
  },
];

export const staffingServices = [
  {
    title: "Executive Recruitment",
    description:
      "Identify and secure senior leaders who shape the future of your organization.",
    benefits: ["C-suite & leadership search", "Confidential headhunting", "Cultural fit assessment"],
  },
  {
    title: "Permanent Staffing",
    description:
      "Long-term hires that strengthen your core teams and institutional knowledge.",
    benefits: ["Full-cycle recruitment", "Pre-vetted candidates", "Reduced time-to-hire"],
  },
  {
    title: "Temporary Staffing",
    description:
      "Flexible workforce solutions that adapt to project peaks and seasonal demand.",
    benefits: ["Rapid deployment", "Scalable headcount", "Compliance managed"],
  },
  {
    title: "Campus Hiring & Job Drives",
    description:
      "Tap into fresh talent through structured campus programs and large-scale drives.",
    benefits: ["University partnerships", "Assessment frameworks", "Volume hiring"],
  },
  {
    title: "Talent Acquisition",
    description:
      "Strategic, data-driven sourcing that builds a sustainable talent pipeline.",
    benefits: ["Employer branding", "Sourcing strategy", "Talent mapping"],
  },
  {
    title: "Manpower Consultancy",
    description:
      "Expert advisory on workforce planning, structure and optimization.",
    benefits: ["Workforce planning", "Cost optimization", "Process advisory"],
  },
];

export const outsourcingServices = [
  {
    title: "IT Outsourcing",
    overview:
      "Offload IT operations to dedicated experts so you can focus on your core business.",
    features: ["Dedicated teams", "Managed services", "24/7 infrastructure & app support"],
    process: ["Assess", "Onboard", "Operate", "Optimize"],
  },
  {
    title: "Software Development",
    overview:
      "Custom, enterprise-grade software engineered for performance and longevity.",
    features: ["Custom & enterprise apps", "API integration", "Legacy modernization"],
    process: ["Discover", "Architect", "Build", "Ship"],
  },
  {
    title: "Web & Mobile App Development",
    overview:
      "Responsive web and native mobile experiences crafted for engagement.",
    features: ["Responsive websites", "iOS & Android apps", "UI/UX design"],
    process: ["Research", "Design", "Develop", "Launch"],
  },
  {
    title: "Cloud & DevOps",
    overview:
      "Migrate, automate and operate cloud infrastructure at enterprise scale.",
    features: ["Cloud migration", "CI/CD pipelines", "Automation & monitoring"],
    process: ["Plan", "Migrate", "Automate", "Monitor"],
  },
  {
    title: "Data Analytics & BI",
    overview:
      "Transform raw data into dashboards and decisions that drive growth.",
    features: ["BI dashboards", "Data visualization", "Reporting pipelines"],
    process: ["Collect", "Model", "Visualize", "Decide"],
  },
  {
    title: "AI / Machine Learning",
    overview:
      "Intelligent systems that predict, automate and create competitive advantage.",
    features: ["Machine learning", "Predictive analytics", "Model deployment"],
    process: ["Explore", "Train", "Validate", "Deploy"],
  },
];

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Staffing Services", to: "/staffing-services" },
  { label: "Outsourcing Services", to: "/outsourcing-services" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
] as const;
