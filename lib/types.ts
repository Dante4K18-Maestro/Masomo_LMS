export type Role = "admin" | "instructor" | "student";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_color: string;
  headline: string | null;
  bio: string | null;
  status: "active" | "suspended";
  created_at: string;
};

export type CourseStatus = "draft" | "published" | "archived";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration_hours: number;
  cover: string;
  status: CourseStatus;
  outcomes: string;
  requirements: string;
  instructor_id: string;
  created_at: string;
  updated_at: string;
  instructor_name?: string;
  instructor_headline?: string | null;
  instructor_color?: string;
  lesson_count?: number;
  module_count?: number;
  student_count?: number;
  assessment_count?: number;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  summary: string | null;
  position: number;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  summary: string | null;
  content: string;
  kind: "reading" | "video" | "lab";
  duration_minutes: number;
  position: number;
};

export type Assessment = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  type: "quiz" | "exam" | "assignment";
  duration_minutes: number;
  pass_score: number;
  status: "draft" | "published" | "archived";
  created_by: string;
  created_at: string;
  updated_at: string;
  course_title?: string;
  course_slug?: string;
  course_cover?: string;
  question_count?: number;
  total_points?: number;
  attempt_count?: number;
  avg_score?: number | null;
  best_passed?: number | null;
  best_score?: number | null;
};

export type Question = {
  id: string;
  assessment_id: string;
  prompt: string;
  type: "multiple_choice" | "true_false";
  points: number;
  position: number;
  options: Option[];
};

export type Option = {
  id: string;
  question_id: string;
  label: string;
  is_correct: number;
  position: number;
};

export type Attempt = {
  id: string;
  assessment_id: string;
  user_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  max_score: number | null;
  passed: number | null;
  status: "in_progress" | "submitted";
  assessment_title?: string;
  course_title?: string;
  course_slug?: string;
  user_name?: string;
  user_email?: string;
  user_color?: string;
};

export type AnswerDetail = {
  id: string;
  question_id: string;
  prompt: string;
  points: number;
  points_awarded: number;
  is_correct: number;
  selected_option_id: string | null;
  selected_label: string | null;
  correct_label: string | null;
  options: Option[];
};

export type Certificate = {
  id: string;
  user_id: string;
  course_id: string;
  code: string;
  issued_at: string;
  course_title?: string;
  course_slug?: string;
  course_cover?: string;
  user_name?: string;
  course_level?: string;
  duration_hours?: number;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  course: Course;
  progress: number;
  completed_lessons: number;
  lesson_count: number;
};
