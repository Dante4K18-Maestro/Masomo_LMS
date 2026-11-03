export const IT_CATEGORIES = [
  "Web Development",
  "Data & AI",
  "Cybersecurity",
  "Cloud & DevOps",
  "Design & Product",
] as const;

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const COURSE_COVERS = [
  { value: "ocean", label: "Ocean", gradient: "from-[#061a33] via-[#0a3a66] to-[#0e7490]" },
  { value: "sunset", label: "Sunset", gradient: "from-[#2a0f0a] via-[#9a3412] to-[#f59e0b]" },
  { value: "dusk", label: "Dusk", gradient: "from-[#150a2a] via-[#3b0764] to-[#7e22ce]" },
  { value: "sky", label: "Sky", gradient: "from-[#06263e] via-[#075985] to-[#0ea5e9]" },
  { value: "violet", label: "Violet", gradient: "from-[#120f35] via-[#4338ca] to-[#a78bfa]" },
  { value: "lime", label: "Lime", gradient: "from-[#101a08] via-[#365314] to-[#a3e635]" },
  { value: "ember", label: "Ember", gradient: "from-[#18110d] via-[#7c2d12] to-[#f97316]" },
] as const;

export const CATEGORY_BLURBS: Record<string, string> = {
  "Web Development": "Build fast, accessible products on the modern web.",
  "Data & AI": "Turn data into decisions and models into products.",
  Cybersecurity: "Protect systems, data, and the people who rely on them.",
  "Cloud & DevOps": "Design reliable infrastructure and ship without fear.",
  "Design & Product": "Make technology feel clear, useful, and human.",
};

export const FAQ_ITEMS = [
  {
    question: "Who is BrighterFuture for?",
    answer:
      "Career switchers, early-career developers, and working technologists who want practical depth. Every course is focused on information technology, from web development to data, cloud, security, and AI.",
  },
  {
    question: "How does learning work?",
    answer:
      "Courses combine focused readings, hands-on labs, and auto-graded assessments. Your progress is saved lesson by lesson, and you can return whenever it suits you.",
  },
  {
    question: "Are the courses self-paced?",
    answer:
      "Yes. Lessons are designed in short, focused units so you can make progress in 20 minutes or spend a weekend building a capstone.",
  },
  {
    question: "Do I earn a certificate?",
    answer:
      "When you complete every lesson in a course and pass its published assessments, BrighterFuture issues a shareable certificate with a unique verification code.",
  },
];
