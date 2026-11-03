export type SeedUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "instructor" | "student";
  color: string;
  headline: string;
  bio?: string;
  status?: "active" | "suspended";
};

export type SeedQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  points?: number;
  type?: "multiple_choice" | "true_false";
};

export type SeedAssessment = {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "exam";
  duration: number;
  passScore: number;
  status: "published" | "draft";
  questions: SeedQuestion[];
};

export type SeedLesson = {
  title: string;
  summary: string;
  content: string;
  kind: "reading" | "video" | "lab";
  duration: number;
};

export type SeedModule = {
  title: string;
  summary: string;
  lessons: SeedLesson[];
};

export type SeedCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  cover: string;
  status: "published" | "draft";
  outcomes: string[];
  requirements: string[];
  instructorId: string;
  modules: SeedModule[];
  assessments: SeedAssessment[];
};

export const seedUsers: SeedUser[] = [
  {
    id: "usr_amara",
    name: "Amara Okafor",
    email: "admin@brighterfuture.dev",
    password: "Admin123!",
    role: "admin",
    color: "lime",
    headline: "Director of Learning",
    bio: "Building pathways from curiosity to confident careers in technology.",
  },
  {
    id: "usr_daniel",
    name: "Daniel Kim",
    email: "instructor@brighterfuture.dev",
    password: "Teach123!",
    role: "instructor",
    color: "electric",
    headline: "Senior Full-Stack Engineer",
    bio: "Former staff engineer at a fintech scale-up. I teach the craft of shipping software that lasts.",
  },
  {
    id: "usr_zara",
    name: "Zara Ahmed",
    email: "zara@brighterfuture.dev",
    password: "Teach123!",
    role: "instructor",
    color: "coral",
    headline: "Cloud & Security Architect",
    bio: "I help teams build secure systems without slowing down. AWS certified, forever curious.",
  },
  {
    id: "usr_mei",
    name: "Mei Tanaka",
    email: "mei@brighterfuture.dev",
    password: "Teach123!",
    role: "instructor",
    color: "violet",
    headline: "Applied Data Scientist",
    bio: "Turning messy data into decisions. I care about models that are useful, fair, and explainable.",
  },
  {
    id: "usr_maya",
    name: "Maya Chen",
    email: "student@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "lime",
    headline: "Aspiring full-stack developer",
    bio: "Career switcher from marketing. Currently building my first SaaS side project.",
  },
  {
    id: "usr_leo",
    name: "Leo Martins",
    email: "leo@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "electric",
    headline: "Frontend developer in training",
    bio: "Obsessed with good interfaces and faster feedback loops.",
  },
  {
    id: "usr_priya",
    name: "Priya Nair",
    email: "priya@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "coral",
    headline: "Data analyst moving into ML",
    bio: "I like asking better questions of data.",
  },
  {
    id: "usr_noah",
    name: "Noah Williams",
    email: "noah@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "amber",
    headline: "Cloud enthusiast",
    bio: "Learning in public, one deployment at a time.",
  },
  {
    id: "usr_sara",
    name: "Sara Haddad",
    email: "sara@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "violet",
    headline: "Product-minded engineer",
    bio: "Design and code should solve the same human problem.",
  },
  {
    id: "usr_tom",
    name: "Tom Owen",
    email: "tom@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "sky",
    headline: "Backend engineer exploring AI",
    bio: "Python, APIs, and a growing notebook collection.",
  },
  {
    id: "usr_jen",
    name: "Jen Alvarez",
    email: "jen@brighterfuture.dev",
    password: "Student123!",
    role: "student",
    color: "emerald",
    headline: "DevOps apprentice",
    bio: "Automating all the repetitive things.",
  },
];

export const seedCourses: SeedCourse[] = [
  {
    id: "crs_fullstack",
    slug: "full-stack-web-development",
    title: "Full-Stack Web Development",
    subtitle:
      "Design, build, and ship modern web applications from database to deployment.",
    description:
      "Go beyond tutorials and learn how real products are assembled. You will build a production-grade application with Next.js, TypeScript, a relational database, authentication, and automated tests — then deploy it with confidence. Every module ends with a practical lab, and the capstone gives you a portfolio piece you can defend in an interview.",
    category: "Web Development",
    level: "Intermediate",
    duration: 36,
    cover: "ocean",
    status: "published",
    outcomes: [
      "Trace a browser request through DNS, HTTP, and a server-rendered app",
      "Design normalized data models and build a typed REST API",
      "Create reusable React components and manage server state",
      "Implement secure authentication and role-based permissions",
      "Write tests that catch regressions before deployment",
      "Ship a full-stack capstone with a CI/CD pipeline",
    ],
    requirements: [
      "Comfort with HTML, CSS, and basic JavaScript",
      "A computer with Node.js 20 or newer installed",
      "No prior backend experience required",
    ],
    instructorId: "usr_daniel",
    modules: [
      {
        title: "The Modern Web Landscape",
        summary: "Build a mental model of what happens between a click and a pixel.",
        lessons: [
          {
            title: "How the web actually works",
            summary:
              "DNS, HTTP, rendering, and the request lifecycle — without the hand-waving.",
            kind: "reading",
            duration: 14,
            content: `## From a click to a rendered page

Every web interaction is a chain of small agreements. When you open \`brighterfuture.dev\`, your browser first asks DNS for an IP address, opens a TCP connection, negotiates TLS, and sends an HTTP request. The server replies with HTML, which the browser parses into the DOM.

The key insight: **the backend and frontend are two halves of one conversation**. A slow query can make a beautiful interface feel broken. A confusing interface can make a solid API feel unreliable.

### The lifecycle in five steps

1. **Resolution** — a domain name becomes an IP address.
2. **Connection** — TCP + TLS establish a trusted channel.
3. **Request** — the browser sends a method, path, headers, and optional body.
4. **Response** — the server returns a status code, headers, and content.
5. **Rendering** — HTML is parsed, CSS is applied, and JavaScript adds behavior.

> **Practice:** Open DevTools, choose the Network tab, and reload this page. Find the document request, then the requests it triggered. Notice which ones block rendering.

Next, we will map those steps onto the tools in our stack.`,
          },
          {
            title: "Your full-stack toolbox",
            summary:
              "Meet the layers of a modern TypeScript stack and what each one is responsible for.",
            kind: "reading",
            duration: 16,
            content: `## One language, many layers

A modern full-stack TypeScript app usually has four layers:

- **Interface** — React components that turn data into an experience.
- **Application** — server handlers, validation, and business rules.
- **Data** — a database and the queries that protect its integrity.
- **Platform** — hosting, logging, secrets, and deployment.

Frameworks such as Next.js blur the boundaries. Server Components can read the database directly, while Client Components handle interaction. That is powerful, but boundaries still matter: keep secrets on the server, validate input at the edge, and never trust a value simply because a form produced it.

### A useful rule of thumb

Put logic where it can be tested. If a rule decides whether a student passes an assessment, it belongs in a pure function — not buried in a click handler.

\`\`\`ts
export function isPassing(score: number, maxScore: number, passMark: number) {
  if (maxScore <= 0) return false;
  return (score / maxScore) * 100 >= passMark;
}
\`\`\`

In the next lesson you will trace a real request through all four layers.`,
          },
          {
            title: "Lab: Trace a request end-to-end",
            summary:
              "Use the browser network panel and a tiny Node server to observe each layer.",
            kind: "lab",
            duration: 35,
            content: `## Your first investigation

In this lab you will run a minimal server and observe exactly what the browser sends.

### Setup

\`\`\`bash
mkdir request-lab && cd request-lab
npm init -y
npm install express
\`\`\`

Create \`server.js\`:

\`\`\`js
import express from "express";
const app = express();

app.get("/", (req, res) => {
  console.log({ method: req.method, path: req.path, agent: req.headers["user-agent"] });
  res.send("<h1>Hello, BrighterFuture</h1>");
});

app.listen(3000, () => console.log("http://localhost:3000"));
\`\`\`

### Your task

1. Visit the page and inspect the request headers.
2. Add a custom header from the browser using \`fetch\`.
3. Break the server route on purpose and observe the status code.
4. Return a JSON response and inspect the \`content-type\` header.

### Submit

Write a short note answering: which layer would you change if the page took 4 seconds to appear, and why? Share it in the cohort channel.`,
          },
        ],
      },
      {
        title: "Building the API Layer",
        summary:
          "Model data, validate input, and design endpoints that are easy to evolve.",
        lessons: [
          {
            title: "Routes, controllers, and clean boundaries",
            summary:
              "A pragmatic structure for server code that stays readable as features grow.",
            kind: "reading",
            duration: 18,
            content: `## Organize by responsibility, not by file type

A common mistake is to put every query, validation, and response in one enormous route handler. Instead, separate:

1. **Transport** — parse the request and shape the response.
2. **Service** — apply business rules and permissions.
3. **Repository** — talk to the database.

This does not require a dozen folders. For a small app, three functions in three files are enough. The point is that each layer has one reason to change.

### Validate at the boundary

\`\`\`ts
const schema = z.object({
  title: z.string().min(3).max(120),
  duration: z.number().int().positive().max(120),
});

const parsed = schema.safeParse(await request.json());
if (!parsed.success) {
  return Response.json({ errors: parsed.error.flatten() }, { status: 422 });
}
\`\`\`

Never let raw input reach a SQL string. Parameterized queries and schema validation are your first two lines of defense.

> **Design prompt:** What should \`POST /enrollments\` return when a student is already enrolled? Decide before writing code, then make every endpoint follow the same convention.`,
          },
          {
            title: "Modeling data that lasts",
            summary:
              "Entities, relationships, constraints, and the cost of getting them wrong.",
            kind: "reading",
            duration: 22,
            content: `## The schema is a contract

A data model is not a diagram you draw once. It is a set of promises the database enforces for years.

### Start with relationships

Our learning platform has users, courses, enrollments, and lessons. Ask three questions for each relationship:

- Is it one-to-one, one-to-many, or many-to-many?
- What must never be duplicated? A student should not enroll twice in the same course.
- What happens when a parent disappears? Deleting a course should cascade to its modules, but deleting an instructor should not silently delete their courses.

\`\`\`sql
CREATE TABLE enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE (user_id, course_id)
);
\`\`\`

That \`UNIQUE\` constraint is more reliable than any check in application code. Constraints are documentation that the database actively enforces.

### Normalize, then denormalize on purpose

Store facts once. If a certificate needs a course title years later, prefer joining to the course over copying the title — unless you need a historical snapshot. Then copy deliberately and name the field so the intent is obvious.

Plan migrations as part of the feature, not as cleanup after launch.`,
          },
          {
            title: "Lab: Build a REST API with validation",
            summary:
              "Implement courses, enrollments, and role checks in a typed API.",
            kind: "lab",
            duration: 45,
            content: `## Build the BrighterFuture API

Create a small API with these endpoints:

| Method | Path | Rule |
| --- | --- | --- |
| GET | /courses | Public, published only |
| POST | /courses | Instructor or admin |
| POST | /courses/:id/enroll | Student, once only |
| GET | /me/enrollments | Authenticated student |

### Requirements

- Validate every request body with a schema.
- Return consistent error objects: \`{ error, fields? }\`.
- Use parameterized SQL for every query.
- Add at least four tests: success, validation failure, duplicate enrollment, forbidden role.

### Stretch goal

Add cursor pagination to \`GET /courses\` instead of page numbers. Explain the trade-off in your README.

When you are done, you will have a small but honest API: permissions are explicit, invalid data is rejected, and duplicate enrollments cannot slip through.`,
          },
        ],
      },
      {
        title: "The React Front End",
        summary:
          "Compose interfaces, handle data fetching, and make loading feel intentional.",
        lessons: [
          {
            title: "Components as a design system",
            summary:
              "Build a small set of primitives that make every screen feel related.",
            kind: "reading",
            duration: 17,
            content: `## Reuse decisions, not just divs

A design system is a shared vocabulary. It starts with tokens — color, spacing, type, radius — and grows into components such as \`Button\`, \`Card\`, and \`ProgressBar\`.

### The component checklist

Before extracting a component, ask:

- Does the same pattern appear at least three times?
- Do all instances share one job?
- Can it be used without knowing its implementation?
- Does it accept content, not just configuration?

A good component API is narrow. \`<Button variant="primary" size="sm">Enroll</Button>\` is clearer than fifteen booleans.

### Compose instead of configure

\`\`\`tsx
<Card>
  <Card.Header>Course progress</Card.Header>
  <Card.Body>
    <Progress value={72} label="9 of 12 lessons" />
  </Card.Body>
</Card>
\`\`\`

Composition keeps components flexible without an explosion of props. It also makes accessibility easier to review because the structure is visible at the call site.

In the lab you will turn these primitives into a dashboard.`,
          },
          {
            title: "State, data fetching, and loading states",
            summary:
              "Choose the right owner for each piece of state — and design the waiting room.",
            kind: "reading",
            duration: 20,
            content: `## Every piece of state needs a home

State that belongs to a single input can stay local. State that many screens need should live closer to the data. A good rule: **derive what you can, store what you must**.

Avoid syncing server data into client state copy by copy. It creates two sources of truth and eventually they disagree.

### The three loading states

1. **Initial load** — show structure, not a blank screen. Skeletons preserve layout.
2. **Background refresh** — keep the old data visible and indicate freshness subtly.
3. **Mutation** — disable the action that is in flight and show the result.

\`\`\`tsx
if (isPending) return <Button disabled>Saving…</Button>;
\`\`\`

An interface that explains what is happening feels faster than one that merely is faster.

### Error states are part of the design

Write the message a tired user needs to read: what happened, what still works, and what they can do next. "Something went wrong" is not an error message.`,
          },
          {
            title: "Lab: Ship a dashboard UI",
            summary:
              "Turn an API into a responsive, accessible learning dashboard.",
            kind: "lab",
            duration: 50,
            content: `## Build a dashboard people can use

Design a dashboard with three zones:

- **Orientation:** greeting, current course, next action.
- **Progress:** course completion and recent assessment results.
- **Discovery:** recommended courses and an upcoming deadline.

### Constraints

- It must work at 360px and 1440px.
- Every interactive element must be reachable by keyboard.
- The page cannot collapse into a blank state while data loads.
- Use at most two font weights and one accent color for actions.

### Accessibility check

1. Tab through the page. Is focus always visible?
2. Zoom to 200%. Does any content disappear?
3. Turn on reduced motion. Does anything still animate unnecessarily?

### Reflection

Write three sentences about what you removed. A dashboard is defined as much by what it leaves out as by what it shows.`,
          },
        ],
      },
      {
        title: "Production Readiness",
        summary:
          "Secure, test, and deploy an application that can survive real users.",
        lessons: [
          {
            title: "Auth, sessions, and permissions",
            summary:
              "Authentication is not authorization — and both must be checked on the server.",
            kind: "reading",
            duration: 21,
            content: `## Prove who they are, then prove what they may do

Authentication answers *who is this user?* Authorization answers *is this action allowed?* A logged-in student is not automatically allowed to edit a course.

### Session security essentials

- Store only an opaque or signed session identifier in an \`httpOnly\`, \`Secure\`, \`SameSite=Lax\` cookie.
- Hash passwords with a slow algorithm such as bcrypt or Argon2.
- Rotate sessions after privilege changes.
- Check permissions in every server action — not only by hiding a button.

\`\`\`ts
export async function updateCourse(userId: string, courseId: string) {
  const user = await getUser(userId);
  const course = await getCourse(courseId);
  if (!user || !course) throw new Error("Not found");
  if (user.role !== "admin" && course.instructorId !== user.id) {
    throw new Error("Forbidden");
  }
  // safe to continue
}
\`\`\`

### Think in threats

What happens if a user edits the hidden course ID? Reuses an expired cookie? Calls an action twice concurrently? Write those tests. Security is the sum of small, boring checks.

> A hidden button is a UX pattern. A server-side permission check is a security control.`,
          },
          {
            title: "Testing and deployment pipelines",
            summary:
              "Catch regressions at the cheapest possible moment and ship on a repeatable path.",
            kind: "reading",
            duration: 19,
            content: `## Confidence is a feature

Tests are not a ritual. They are how you keep moving quickly after the codebase grows beyond your memory.

### The practical test pyramid

- **Unit tests** for pure rules: grading, progress, permissions.
- **Integration tests** for API and database behavior.
- **End-to-end tests** for critical journeys: sign in, enroll, learn, assess.

\`\`\`ts
test("a score at the pass mark passes", () => {
  expect(isPassing(7, 10, 70)).toBe(true);
});
\`\`\`

### A minimum healthy pipeline

1. Install with a frozen lockfile.
2. Type-check.
3. Run unit and integration tests.
4. Build the production bundle.
5. Deploy to a preview environment.
6. Run smoke tests against the preview.

Automate the boring steps. Humans should review decisions, not remember commands.

### Deployment checklist

Environment variables set separately per environment; database migrations run before traffic; health check endpoint; structured logs; rollback path documented. If you cannot roll back, you are not ready to roll forward.

The capstone asks you to put all of this together.`,
          },
          {
            title: "Capstone: Ship the full stack",
            summary:
              "Take a product idea from schema to a deployed, tested application.",
            kind: "lab",
            duration: 180,
            content: `## The BrighterFuture capstone

Build a small learning product with at least three core flows:

1. A visitor can browse published courses and view a curriculum.
2. A student can register, enroll, complete lessons, and take an assessment.
3. An instructor can create a course, publish it, and see student progress.

### Technical requirements

- Typed end-to-end: database records, server handlers, and UI props.
- Server-side authorization on every mutation.
- At least one automated test per critical rule.
- Responsive and keyboard accessible.
- Deployed publicly with a seeded demo account.

### Deliverables

- A live URL
- A README with architecture decisions and trade-offs
- A three-minute walkthrough video
- One bug you found and how you fixed it

### Interview framing

Be ready to answer: *What would you change if this app had 100,000 students?* Discuss indexes, caching, queueing, and the risks of premature complexity. A thoughtful answer is stronger than a fashionable one.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_fullstack",
        title: "Full-Stack Knowledge Check",
        description:
          "A 15-minute checkpoint on web fundamentals, data modeling, and secure server design.",
        type: "quiz",
        duration: 15,
        passScore: 70,
        status: "published",
        questions: [
          {
            prompt: "Which HTTP status code best represents invalid input sent to an API?",
            options: ["200 OK", "301 Moved Permanently", "422 Unprocessable Content", "500 Internal Server Error"],
            correct: 2,
            points: 10,
          },
          {
            prompt: "What does a UNIQUE constraint on (user_id, course_id) prevent?",
            options: [
              "A course being deleted",
              "The same student enrolling twice",
              "Students enrolling in more than one course",
              "Instructors editing a course",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Authentication and authorization mean the same thing.",
            options: ["True", "False"],
            correct: 1,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "Where should a permission check for editing a course live?",
            options: [
              "Only in the UI by hiding the button",
              "In the browser developer console",
              "On the server for every mutation",
              "In the CSS",
            ],
            correct: 2,
            points: 10,
          },
          {
            prompt: "Which loading state keeps layout stable while initial data arrives?",
            options: [
              "A blank white screen",
              "A skeleton that mirrors the final layout",
              "An alert dialog",
              "Redirecting to the login page",
            ],
            correct: 1,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_python",
    slug: "data-science-with-python",
    title: "Data Science with Python",
    subtitle:
      "Turn raw data into clear insight with Python, pandas, and visual storytelling.",
    description:
      "Learn the practical craft of data science: asking sharper questions, cleaning messy data, finding real signal, and communicating what matters. You will work in notebooks and scripts, build repeatable analysis pipelines, and finish with a churn prediction project that connects evidence to a business decision.",
    category: "Data & AI",
    level: "Beginner",
    duration: 28,
    cover: "sunset",
    status: "published",
    outcomes: [
      "Set up a reproducible Python analysis environment",
      "Clean, reshape, and join real-world datasets with pandas",
      "Choose visualizations that reveal rather than decorate",
      "Engineer useful features and avoid data leakage",
      "Train and evaluate a baseline scikit-learn model",
      "Present an analysis with a clear recommendation",
    ],
    requirements: [
      "Basic Python syntax (variables, loops, functions)",
      "Python 3.11+ and Jupyter installed",
      "Curiosity about messy real-world data",
    ],
    instructorId: "usr_mei",
    modules: [
      {
        title: "Python for Data",
        summary: "Build a reliable workflow and learn the pandas moves you will use daily.",
        lessons: [
          {
            title: "Setting up a data workflow",
            summary:
              "Environments, notebooks, and the habits that make analysis reproducible.",
            kind: "reading",
            duration: 15,
            content: `## Reproducible beats clever

A data analysis is only useful if someone else can run it. Start with a clean environment, a pinned dependency file, and a project structure that separates raw data from generated output.

\`\`\`bash
python -m venv .venv
source .venv/bin/activate
pip install pandas jupyter scikit-learn matplotlib
pip freeze > requirements.txt
\`\`\`

### The folder contract

- \`data/raw/\` — never edit these files.
- \`data/processed/\` — generated by code.
- \`notebooks/\` — exploration.
- \`src/\` — reusable functions and pipeline code.

Notebooks are excellent for thinking. They are poor production systems. Once a step matters more than once, move it into \`src/\`.

> **Habit:** restart the kernel and run all cells before sharing a notebook. If it breaks, your analysis depends on hidden state.`,
          },
          {
            title: "NumPy and pandas essentials",
            summary:
              "Indexing, filtering, grouping, joining, and the mental model behind DataFrames.",
            kind: "reading",
            duration: 24,
            content: `## Think in columns

A pandas DataFrame is a set of labeled columns sharing an index. Most confusion comes from forgetting which operation preserves the index and which resets it.

\`\`\`python
import pandas as pd

orders = pd.read_csv("data/raw/orders.csv", parse_dates=["ordered_at"])
active = orders[orders["status"] != "cancelled"]

weekly = (
    active.groupby(pd.Grouper(key="ordered_at", freq="W"))
    .agg(revenue=("total", "sum"), orders=("id", "nunique"))
    .reset_index()
)
\`\`\`

### Four questions before every transformation

1. What is one row? Write it down.
2. What should happen to missing values?
3. Could this join duplicate rows?
4. Is the result sorted deterministically?

Use \`.shape\`, \`.head()\`, \`.info()\`, and \`.isna().sum()\` constantly. Verification between steps is cheaper than debugging a beautiful but wrong chart.`,
          },
          {
            title: "Lab: Clean a messy dataset",
            summary:
              "Profile, repair, and document a deliberately imperfect customer dataset.",
            kind: "lab",
            duration: 45,
            content: `## Make the data trustworthy

Download the cohort dataset \`customers_messy.csv\`. It contains duplicate IDs, inconsistent country names, impossible dates, and missing revenue values.

### Your tasks

1. Profile each column: type, missingness, cardinality, range.
2. Define one row of the dataset in a markdown cell.
3. Fix duplicate customers with a documented rule.
4. Standardize country names using a mapping.
5. Flag — do not silently drop — impossible values.
6. Save the cleaned data to \`data/processed/customers.csv\`.

### Constraints

- Every transformation lives in a function.
- The notebook runs top-to-bottom after a kernel restart.
- Your decisions are recorded in a short data dictionary.

### Reflection

What did you choose not to fix, and what risk does that leave for downstream analysis? There is no perfect dataset. There is only documented judgement.`,
          },
        ],
      },
      {
        title: "Analysis & Storytelling",
        summary: "Find signal, challenge it, and communicate it without exaggeration.",
        lessons: [
          {
            title: "Exploratory analysis that finds signal",
            summary:
              "A disciplined loop for moving from questions to evidence.",
            kind: "reading",
            duration: 20,
            content: `## Start with a decision, not a chart

Useful analysis begins with a decision someone needs to make: *Should we change onboarding? Which customers are likely to churn? Where is support volume growing?*

### The exploration loop

1. State a question small enough to answer.
2. Identify the metric and its denominator.
3. Segment the data and look for differences.
4. Check the differences against alternative explanations.
5. Decide whether the evidence is strong enough to act.

### Beware the exciting result

A spike may be a tracking change. A correlation may be driven by one outlier. A segment may contain eleven people. Compute counts alongside percentages and inspect distributions, not only averages.

\`\`\`python
summary = df.groupby("plan").agg(
    customers=("customer_id", "nunique"),
    churn_rate=("churned", "mean"),
    avg_tenure=("tenure_months", "mean"),
).sort_values("churn_rate", ascending=False)
\`\`\`

Write your provisional conclusion before making the chart. Then ask what evidence would change your mind.`,
          },
          {
            title: "Visualization principles",
            summary:
              "Design charts that answer one question at a time and survive a skeptical reader.",
            kind: "reading",
            duration: 16,
            content: `## Clarity is the chart's job

A chart is an argument. Every mark should help the reader evaluate it.

### Choose by question

- **Comparison** — horizontal bars.
- **Distribution** — histogram or box plot.
- **Trend over time** — line.
- **Relationship** — scatter, with attention to density.
- **Part of whole** — stacked bar, rarely a pie.

### Remove decoration

Drop heavy gridlines, 3D effects, redundant legends, and axes that imply precision the data does not have. Label directly where possible. Start bar charts at zero. Use color to encode meaning, not to decorate.

\`\`\`python
ax = summary.plot.barh(x="plan", y="churn_rate", color="#3678f6")
ax.set_xlabel("Churn rate")
ax.set_ylabel("")
ax.set_title("Starter plan churns most in month one")
ax.spines[["top", "right"]].set_visible(False)
\`\`\`

A reader should understand the takeaway in five seconds and be able to verify the scale in the next five.`,
          },
          {
            title: "Lab: Build an insight report",
            summary:
              "Turn an exploratory analysis into a one-page decision memo with charts.",
            kind: "lab",
            duration: 50,
            content: `## Write for the decision-maker

Use the cleaned customer dataset from the previous lab.

### Deliverable

A one-page report containing:

- The decision context in two sentences.
- Three findings, each with one chart and one caveat.
- A recommendation with expected impact and a way to measure it.
- One limitation you could not resolve with this data.

### Quality bar

- Every percentage has a count behind it.
- Every chart has a title that states a finding.
- No chart requires reading your notebook to interpret.
- The recommendation does not exceed what the evidence supports.

### Stretch goal

Create a function that takes a segment column and returns a formatted table and chart. Reuse it to compare plans, channels, and tenures.

> Strong analysts are trusted not because they sound certain, but because they are clear about what they know.`,
          },
        ],
      },
      {
        title: "From Analysis to Model",
        summary: "Engineer honest features, train a baseline, and evaluate it properly.",
        lessons: [
          {
            title: "Feature engineering and leakage",
            summary:
              "Create signal from raw fields without accidentally peeking at the future.",
            kind: "reading",
            duration: 22,
            content: `## Features encode assumptions

Feature engineering turns raw records into inputs a model can use. It also introduces your biggest risk: leakage.

### Leakage looks like success

If a churn dataset includes \`cancelled_at\`, the model may predict churn perfectly — because the cancellation already happened. Any feature that would not exist at prediction time is off limits.

### Useful starting points

- **Dates:** account age, day of week, days since last login.
- **Categories:** one-hot encoding, grouping rare values.
- **Counts:** number of support tickets, sessions, failed payments.
- **Ratios:** tickets per month, usage per seat.

\`\`\`python
df["tenure_months"] = (df["snapshot_date"] - df["signup_date"]).dt.days / 30.44
df["tickets_per_month"] = df["support_tickets"] / df["tenure_months"].clip(lower=1)
\`\`\`

Split data by time before computing aggregates where possible. Fit encoders and scalers on training data only. If a number would be unavailable on the day you make the prediction, do not let the model see it.`,
          },
          {
            title: "Your first scikit-learn model",
            summary:
              "A complete, honest baseline from split to evaluation to interpretation.",
            kind: "reading",
            duration: 25,
            content: `## Baseline first, complexity later

A baseline gives you something to beat and a sanity check when a complex model produces beautiful nonsense.

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = RandomForestClassifier(n_estimators=300, random_state=42)
model.fit(X_train, y_train)
probs = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, model.predict(X_test)))
print("ROC AUC:", roc_auc_score(y_test, probs))
\`\`\`

### Choose metrics with the decision in mind

Accuracy can look excellent when only 5% of customers churn. Precision, recall, and the confusion matrix reveal different costs. For a retention campaign, you may care more about ranking likely churners than about a single threshold.

### Tune with discipline

Use cross-validation on the training set. Touch the test set once, at the end. Then ask whether the gain over the baseline is worth the added complexity.`,
          },
          {
            title: "Capstone: Predict customer churn",
            summary:
              "Deliver a reproducible model, evaluation, and decision recommendation.",
            kind: "lab",
            duration: 120,
            content: `## From dataset to decision

Build a churn prediction project for a subscription business.

### Required pipeline

1. Load and validate the raw data.
2. Explore and document key patterns.
3. Split by time or stratified random split.
4. Engineer features without leakage.
5. Train a baseline and one improved model.
6. Evaluate with precision, recall, ROC AUC, and a calibration check.
7. Produce a short recommendation for the retention team.

### Reproducibility requirements

- One command runs the pipeline end-to-end.
- Dependencies are pinned.
- Random seeds are explicit.
- Metrics and charts are written to an output folder.

### Present it

Create a five-slide story: context, evidence, model, trade-offs, recommendation. Include what you would do with another month and a larger dataset. Finish with the limitation you are least comfortable with — naming it builds trust.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_python",
        title: "Python Data Foundations",
        description:
          "Test your understanding of pandas workflows, honest analysis, and baseline modeling.",
        type: "quiz",
        duration: 12,
        passScore: 70,
        status: "published",
        questions: [
          {
            prompt: "What is one row in a customer table?",
            options: ["One column", "One customer", "One analysis step", "One chart"],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which operation is best for summarizing churn by plan?",
            options: ["groupby", "pivot_table only", "read_csv", "set_index"],
            correct: 0,
            points: 10,
          },
          {
            prompt: "Data leakage usually makes model results look worse than they are.",
            options: ["True", "False"],
            correct: 1,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "Why pair percentages with counts?",
            options: [
              "To make charts colorful",
              "To reveal small segments that percentages can exaggerate",
              "To avoid using pandas",
              "To increase model accuracy",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "When should you touch the test set?",
            options: [
              "After every feature change",
              "Before training",
              "Once, after model selection is complete",
              "Only during data cleaning",
            ],
            correct: 2,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_cyber",
    slug: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    subtitle:
      "Think like an attacker, defend like a pro, and secure the modern stack.",
    description:
      "Security is a practical discipline, not a checklist. This course builds the attacker mindset and defender's toolkit through threat modeling, hands-on vulnerability analysis, and incident response. You will learn the OWASP risks that matter most, design layered defenses, and practice communicating risk clearly to people who make decisions.",
    category: "Cybersecurity",
    level: "Beginner",
    duration: 24,
    cover: "dusk",
    status: "published",
    outcomes: [
      "Apply the CIA triad and build useful threat models",
      "Map an application's attack surface from an attacker's perspective",
      "Identify and mitigate common OWASP web vulnerabilities",
      "Design authentication, authorization, and network defenses",
      "Build a practical incident response playbook",
      "Communicate security risk to non-technical stakeholders",
    ],
    requirements: [
      "Comfort using a browser and the command line",
      "Basic understanding of how web applications work",
      "No offensive security experience required",
    ],
    instructorId: "usr_zara",
    modules: [
      {
        title: "Security Foundations",
        summary: "Learn the questions that turn vague anxiety into a concrete security plan.",
        lessons: [
          {
            title: "The CIA triad and threat models",
            summary:
              "Confidentiality, integrity, availability — and how to model what could go wrong.",
            kind: "reading",
            duration: 18,
            content: `## Security starts with assets and adversaries

The CIA triad gives us three lenses:

- **Confidentiality** — only the right people can read the data.
- **Integrity** — data and systems cannot be changed undetected.
- **Availability** — legitimate users can access the service when needed.

Every control trades one against another. Aggressive rate limiting protects availability from abuse but can lock out real users. Encryption protects confidentiality but adds key-management risk.

### A simple threat model

For each asset, ask:

1. What are we protecting?
2. Who might want it, and why?
3. How could they reach it?
4. What would the impact be?
5. Which mitigation gives the best return?

\`\`\`text
Asset: student assessment answers
Adversary: student seeking a better grade
Path: direct API call with another student's attempt ID
Impact: lost integrity, unfair certification
Control: server-side ownership check on every attempt read
\`\`\`

A threat model is useful when it changes a decision. Keep it short enough that engineers actually use it.`,
          },
          {
            title: "How attackers map a target",
            summary:
              "Reconnaissance, attack surface, and the value of seeing your own system clearly.",
            kind: "reading",
            duration: 20,
            content: `## Attackers gather what you expose

Attacker reconnaissance is mostly patient observation: DNS records, open ports, public repositories, error messages, employee information, and application behavior. None of these is a breach by itself. Together they form a map.

### The attack surface

- **Human:** phishing, social engineering, weak recovery flows.
- **Network:** unused ports, exposed admin panels, missing segmentation.
- **Application:** input handling, session logic, access control.
- **Supply chain:** dependencies, build pipelines, third-party scripts.
- **Data:** backups, exports, logs, and forgotten test environments.

### Defensive habits

Remove what you do not need. Return generic error messages to users while logging detail internally. Treat staging as production-like because it often holds production data. Monitor dependency advisories and patch deliberately.

> **Red-team question:** If I had read your public documentation and one leaked employee email, what would I try next?

Mapping the surface is not paranoia. It is prioritization.`,
          },
          {
            title: "Lab: Threat model a web app",
            summary:
              "Produce a focused threat model for a learning platform with real trade-offs.",
            kind: "lab",
            duration: 40,
            content: `## Threat model BrighterFuture

Work in a team of two. Use the platform's flows: registration, enrollment, lesson access, assessment attempts, and certificates.

### Step 1 — Draw the system

Sketch users, browser, application server, database, file storage, and any third-party services. Mark trust boundaries with dashed lines.

### Step 2 — Identify assets

List at least six assets ranked by impact if compromised. Include assessment integrity and personal data.

### Step 3 — Build a threat table

For the five highest-impact threats, record:

| Threat | Path | Impact | Likelihood | Control |
| --- | --- | --- | --- | --- |
| Attempt manipulation | Forged attempt ID | False certificate | Medium | Ownership checks, audit log |
| Credential stuffing | Login endpoint | Account takeover | High | Rate limits, MFA, monitoring |

### Step 4 — Make a recommendation

Choose one control to implement first. Explain its cost, what it blocks, and what it does not block. Submit your model as a one-page PDF.`,
          },
        ],
      },
      {
        title: "Defending the Stack",
        summary: "Turn identity and input handling into reliable lines of defense.",
        lessons: [
          {
            title: "Authentication and access control",
            summary:
              "Sessions, MFA, least privilege, and the mistakes that bypass them.",
            kind: "reading",
            duration: 24,
            content: `## Identity is the new perimeter

Most serious application breaches involve stolen or misused credentials. Defenses must address both.

### Authentication

- Hash passwords with Argon2id or bcrypt; never encrypt them.
- Enforce rate limits and lockout backoff on login.
- Prefer passkeys or MFA where the risk justifies friction.
- Use generic login errors to avoid account enumeration.
- Invalidate sessions after password changes.

### Authorization

Every request must answer: *may this subject perform this action on this object?* Hiding UI is not a control.

\`\`\`ts
if (attempt.userId !== currentUser.id) {
  return forbidden(); // students may only read their own attempt
}
\`\`\`

### Least privilege

Grant the minimum access needed, for the minimum time. A support agent does not need database administrator access. A background job should not use a human's master key. Separate roles, scope tokens, and audit privileged actions.

> Design for the stolen session: what can an attacker do with a valid cookie, and how quickly would you detect it?`,
          },
          {
            title: "Web vulnerabilities: OWASP Top 10",
            summary:
              "The high-impact classes of web bugs, why they persist, and how to stop them.",
            kind: "reading",
            duration: 26,
            content: `## Know the recurring failure modes

The OWASP Top 10 is not a checklist to finish. It is a map of where web applications keep failing.

### Broken access control

The most common serious flaw. Test every object ID against a different role. Default deny.

### Injection

Use parameterized queries and context-aware output encoding. Never concatenate untrusted input into SQL, shell commands, or HTML.

\`\`\`sql
-- Safe: the value is data, not code
SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?;
\`\`\`

### Vulnerable and outdated components

Track dependencies, remove unused packages, and patch with a defined cadence.

### Cryptographic failures

Use modern TLS, strong password hashing, and managed secret storage. Do not invent encryption.

### Security misconfiguration

Disable debug mode in production, remove default accounts, set security headers, and restrict CORS.

### Other recurring risks

Insecure design, identification failures, logging gaps, SSRF, and integrity failures. For each, ask what one preventive control and one detective control you would add.`,
          },
          {
            title: "Lab: Find and fix an injection flaw",
            summary:
              "Exploit a deliberately vulnerable endpoint, then rebuild it safely.",
            kind: "lab",
            duration: 45,
            content: `## Break it, then repair it

A small course search API at \`/api/courses?q=\` builds SQL with string concatenation.

### Your tasks

1. Reproduce a benign injection in the local lab that returns courses it should not.
2. Identify the trust boundary and the missing control.
3. Rewrite the query using parameters.
4. Add input validation and a safe error response.
5. Write a regression test that fails on the original code and passes on your fix.
6. Search the rest of the lab for similar patterns.

### Do not stop at the first fix

Injection usually appears in more than one place. Review search, sorting, filters, and export endpoints.

### Write-up

Explain in plain language: what an attacker could read or change, what data was at risk, and how the fix prevents recurrence. Include one preventive and one detective control you would add at the platform level.`,
          },
        ],
      },
      {
        title: "Operations & Response",
        summary: "Detect, contain, learn — and build security that survives busy Tuesdays.",
        lessons: [
          {
            title: "Network security and monitoring",
            summary:
              "Layered network controls and the signals worth alerting on.",
            kind: "reading",
            duration: 20,
            content: `## Detect what matters, not everything

A security operations center drowns in alerts. Useful monitoring starts with critical assets and known attack paths.

### Layered controls

- Segment networks so a compromised web server cannot reach the customer database directly.
- Use a web application firewall as one layer — never the only layer.
- Require TLS everywhere, including internal service-to-service calls.
- Keep secrets in a managed store with audit trails and rotation.
- Log authentication events, privilege changes, and sensitive data access.

### Signals with high value

- Repeated failed logins followed by a success.
- A user downloading far more records than usual.
- New admin account created outside a change window.
- Outbound traffic to an unusual destination.
- Sudden errors from authorization checks.

### Tune for action

Every alert needs an owner, a severity, and a first step. If nobody knows what to do when it fires, it is noise. Measure mean time to acknowledge and mean time to contain, not the number of alerts.

> Detection without a response plan is just expensive logging.`,
          },
          {
            title: "Incident response playbooks",
            summary:
              "A calm, repeatable process for the worst day of the quarter.",
            kind: "reading",
            duration: 22,
            content: `## Prepare before the adrenaline

Incident response is a team sport under uncertainty. The goal is to reduce harm, preserve evidence, and restore trust.

### The lifecycle

1. **Prepare** — roles, contacts, access, backups, and tested playbooks.
2. **Identify** — confirm whether an event is a security incident.
3. **Contain** — isolate affected systems without destroying evidence.
4. **Eradicate** — remove the root cause and persistence.
5. **Recover** — restore service carefully and monitor for recurrence.
6. **Learn** — blameless review with concrete owners and dates.

### A starter playbook

\`\`\`text
Trigger: confirmed credential compromise
Owner: on-call security lead
1. Revoke active sessions for the account.
2. Reset credentials and require MFA.
3. Review access logs for the preceding 14 days.
4. Notify the data protection lead if personal data was accessed.
5. Document every action with timestamps.
\`\`\`

### Communication matters

Give stakeholders what they need: impact, current status, next update time. Avoid speculation. Preserve a single incident log. After recovery, publish a post-incident review that focuses on system fixes, not blame.`,
          },
          {
            title: "Capstone: Secure a small business",
            summary:
              "Apply the full toolkit to a realistic security assessment and roadmap.",
            kind: "lab",
            duration: 120,
            content: `## Build a security plan that fits the business

Choose the fictional Northwind Coaching business. It has 18 staff, a public website, an online store, a shared drive, and one overworked operations manager.

### Deliverables

1. **Asset inventory** — data, systems, people, and dependencies.
2. **Threat model** — top five scenarios with impact and likelihood.
3. **Gap assessment** — identity, endpoint, network, backup, and response.
4. **Prioritized roadmap** — quick wins in 30 days, structural work in 90 days, long-term investments.
5. **Executive summary** — one page, no jargon, with a clear risk statement.

### Constraints

- The business can spend $2,000 in the first month.
- The manager can dedicate four hours per week.
- The website must stay online during remediation.

### Presentation

Present for eight minutes. Expect questions about cost, operational disruption, and how you would measure improvement. A credible plan acknowledges trade-offs and names what is still exposed.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_cyber",
        title: "Security Essentials Exam",
        description:
          "A 20-minute exam covering threat modeling, access control, OWASP risks, and incident response.",
        type: "exam",
        duration: 20,
        passScore: 75,
        status: "published",
        questions: [
          {
            prompt: "Which risk is most directly reduced by parameterized SQL queries?",
            options: ["Phishing", "SQL injection", "DDoS", "Insider fraud"],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Hiding an admin button is sufficient authorization for an API endpoint.",
            options: ["True", "False"],
            correct: 1,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "What is the primary purpose of containing an incident?",
            options: [
              "To identify the attacker publicly",
              "To limit further harm while preserving evidence",
              "To restore all services immediately",
              "To avoid informing stakeholders",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which is the strongest password storage approach?",
            options: [
              "Reversible AES encryption",
              "Plain text with strict file permissions",
              "Argon2id or bcrypt hashing",
              "Base64 encoding",
            ],
            correct: 2,
            points: 10,
          },
          {
            prompt: "What makes a security alert actionable?",
            options: [
              "It fires frequently",
              "It has an owner, severity, and defined first step",
              "It is only visible to executives",
              "It uses machine learning",
            ],
            correct: 1,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_cloud",
    slug: "cloud-engineering-on-aws",
    title: "Cloud Engineering on AWS",
    subtitle:
      "Architect resilient, cost-aware systems on the world's most widely used cloud.",
    description:
      "Move from clicking around a console to designing dependable cloud systems. This course covers AWS foundations, high availability, infrastructure as code, and deployment pipelines. You will build a production-style network, reason about failure, and deliver a capstone architecture with cost and recovery plans — not just a diagram.",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: 30,
    cover: "sky",
    status: "published",
    outcomes: [
      "Explain regions, availability zones, and shared responsibility",
      "Choose core AWS services for compute, storage, and networking",
      "Design a highly available, multi-AZ application",
      "Automate cloud infrastructure with Terraform",
      "Build a CI/CD pipeline for infrastructure changes",
      "Estimate cost and document a disaster recovery strategy",
    ],
    requirements: [
      "Basic Linux command-line skills",
      "An AWS account (free tier is sufficient for labs)",
      "Familiarity with one programming language",
    ],
    instructorId: "usr_zara",
    modules: [
      {
        title: "Cloud Foundations",
        summary: "Understand the primitives before you start connecting them.",
        lessons: [
          {
            title: "Regions, AZs, and shared responsibility",
            summary:
              "The geography and agreements that shape every cloud architecture decision.",
            kind: "reading",
            duration: 16,
            content: `## The cloud is someone else's computer — with contracts

An AWS **Region** is a geographic area. Each region contains multiple **Availability Zones (AZs)**: physically separate data centers with independent power and networking, connected by low-latency links.

### Design for failure

If everything lives in one AZ, an AZ outage takes your application down. Multi-AZ design is the default for production systems that need resilience.

### Shared responsibility

AWS secures the cloud: physical facilities, hardware, and the hypervisor. You secure what you put *in* the cloud: identity, data, network configuration, patching of your workloads, and access policies.

> **Exercise:** For an S3 bucket, list three controls AWS owns and three you own. The line moves with service type, which is why managed does not mean automatically secure.

Choose a region close to users and compliant with data residency requirements. Cost and service availability vary by region, so treat this as an architecture decision, not a toggle.`,
          },
          {
            title: "Core AWS services",
            summary:
              "Compute, storage, networking, identity, and the jobs each service is best at.",
            kind: "reading",
            duration: 22,
            content: `## A useful starting map

You do not need 200 services. You need the right service for a clear job.

- **IAM** — identity, roles, and least-privilege access.
- **VPC** — your isolated network: subnets, routes, gateways.
- **EC2** — virtual servers when you need full control.
- **Lambda** — short event-driven functions without server management.
- **S3** — durable object storage for files and static assets.
- **RDS** — managed relational databases with backups and failover options.
- **CloudFront** — global content delivery and edge caching.
- **CloudWatch** — logs, metrics, and alarms.

### Managed versus self-managed

Managed services reduce operational burden but constrain customization. Self-managed gives control and responsibility. Choose based on team capacity, not fashion.

\`\`\`text
Static site: S3 + CloudFront + Route 53
API:      ECS Fargate or Lambda + API Gateway
Data:     RDS Multi-AZ + automated backups
Security: IAM roles, KMS, CloudTrail
\`\`\`

Name the failure mode each component is meant to handle before adding it.`,
          },
          {
            title: "Lab: Deploy your first VPC",
            summary:
              "Create a segmented network with public and private subnets across two AZs.",
            kind: "lab",
            duration: 50,
            content: `## Build the network foundation

Create a VPC with CIDR \`10.20.0.0/16\` across two availability zones.

### Requirements

- Two public subnets for load balancers.
- Two private subnets for application servers.
- An internet gateway for public egress.
- A NAT gateway for private subnet outbound traffic.
- Route tables with explicit associations.
- A security group that allows HTTP only from the load balancer.

### Validation

1. Launch one instance in each public subnet and confirm internet reachability.
2. Launch an instance in a private subnet and confirm it can pull updates but cannot be reached from the internet.
3. Use VPC Reachability Analyzer to explain one blocked path.
4. Draw the architecture, including CIDR ranges.

### Cost note

NAT gateways are billed hourly and per GB. In a sandbox, use one NAT gateway to control cost and note that production multi-AZ designs usually use one per AZ. Document the trade-off.

Clean up all resources after the lab.`,
          },
        ],
      },
      {
        title: "Reliability & Scale",
        summary: "Design systems that bend without breaking — and recover when they do.",
        lessons: [
          {
            title: "Load balancing and auto scaling",
            summary:
              "Distribute traffic, scale on meaningful signals, and avoid thundering herds.",
            kind: "reading",
            duration: 20,
            content: `## Scale the bottleneck, not the dashboard

An Application Load Balancer distributes requests to healthy targets across AZs. Auto Scaling adjusts capacity based on metrics or schedules.

### A sane scaling setup

- Register targets in multiple AZs.
- Use health checks that reflect real readiness, not just process liveness.
- Scale on a leading indicator such as queue depth or requests per target.
- Set both minimum and maximum capacity.
- Add cool-down periods to prevent rapid oscillation.

\`\`\`text
Target tracking: average CPU at 55%
Minimum: 2 instances (one per AZ)
Maximum: 12 instances
Scale-out cooldown: 60s
Scale-in cooldown: 300s
\`\`\`

### Stateless is the enabler

Store sessions in a shared store, uploads in object storage, and logs centrally. If every request must return to the same instance, scaling becomes fragile.

Test a scale-in event during business hours. Verify that connections drain and users do not notice.`,
          },
          {
            title: "Storage, backup, and disaster recovery",
            summary:
              "RPO, RTO, and the difference between a backup and a recovery plan.",
            kind: "reading",
            duration: 21,
            content: `## Plan for recovery, not just backup

Two numbers define your recovery strategy:

- **RPO (Recovery Point Objective):** how much data can you afford to lose?
- **RTO (Recovery Time Objective):** how long can the service be down?

These determine architecture and cost. A four-hour RTO accepts different choices than four minutes.

### Layers of protection

- Versioning and lifecycle rules for object storage.
- Automated database snapshots and point-in-time recovery.
- Cross-region replication for critical data.
- Immutable backups to resist ransomware.
- Documented restore procedures, tested quarterly.

### The test that matters

A backup you have never restored is a hope. Restore into an isolated environment, measure the time, verify integrity, then destroy the environment. Record the result.

\`\`\`text
RPO: 15 minutes  → frequent transaction logs / replication
RTO: 1 hour     → pre-built infrastructure and runbooks
\`\`\`

Disaster recovery is a product decision. Get the business owner to sign the targets.`,
          },
          {
            title: "Lab: Design for high availability",
            summary:
              "Architect a two-AZ web application and prove its failure behavior.",
            kind: "lab",
            duration: 55,
            content: `## Survive an AZ

Design and deploy a small web application with:

- An ALB in two public subnets.
- Two application instances in private subnets in different AZs.
- A Multi-AZ database (or a documented simulated equivalent).
- Health checks, CloudWatch alarms, and centralized logs.
- A static asset bucket with versioning enabled.

### Failure test

Simulate the loss of one application instance. Confirm the ALB drains traffic and service remains available. Then describe what would happen if an entire AZ failed, and what still depends on that AZ.

### Deliverable

A one-page resilience brief:

1. Architecture diagram
2. Availability targets
3. RPO and RTO
4. Known single points of failure
5. Monthly cost estimate

The most important sentence is the one naming what you did **not** make highly available, and why.`,
          },
        ],
      },
      {
        title: "Infrastructure as Code",
        summary: "Make environments repeatable, reviewable, and safe to change.",
        lessons: [
          {
            title: "Terraform fundamentals",
            summary:
              "Providers, resources, state, and the plan-apply workflow that keeps teams honest.",
            kind: "reading",
            duration: 23,
            content: `## Describe the destination

Terraform reads configuration, compares it with state, and proposes a plan. That plan is the most valuable part of the workflow: it is a reviewable preview of change.

\`\`\`hcl
resource "aws_s3_bucket" "assets" {
  bucket = "brighterfuture-assets-prod"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}
\`\`\`

### State is sensitive

Terraform state maps configuration to real resources and can contain secrets. Store it remotely with encryption and locking. Never commit it.

### Workflow discipline

1. Format and validate.
2. Plan against the target workspace.
3. Review the plan — especially destroys and replacements.
4. Apply only the reviewed plan.
5. Tag resources for owner, environment, and cost.

\`\`\`bash
terraform fmt -check
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
\`\`\`

Use modules for patterns that repeat, but avoid abstracting before the second or third use.`,
          },
          {
            title: "CI/CD for cloud infrastructure",
            summary:
              "Automate plans, require review, and use short-lived credentials.",
            kind: "reading",
            duration: 19,
            content: `## Treat infrastructure like product code

A healthy infrastructure pipeline:

1. Runs formatting and validation on every pull request.
2. Produces a Terraform plan and posts it as a review comment.
3. Applies only after approval on the main branch.
4. Uses OIDC federation for short-lived cloud credentials.
5. Stores state remotely with locking.
6. Runs policy checks for public buckets, open security groups, and missing tags.

### Guardrails beat warnings

Policy as code can block a plan that exposes an S3 bucket publicly. A warning in a long log is easy to miss. Make the safe path the default and the unsafe path explicit.

### Keep a rollback story

For application code, redeploy the previous artifact. For infrastructure, a rollback may mean applying a previous commit — but state may have drifted. Test rollbacks. Back up state before risky migrations.

Review plans for the quiet lines: a security group rule removed, an index dropped, an encryption setting replaced. The dangerous change is rarely the one with the big diff.`,
          },
          {
            title: "Capstone: Production-ready AWS environment",
            summary:
              "Deliver code, architecture, runbooks, and cost estimates for a real workload.",
            kind: "lab",
            duration: 150,
            content: `## Ship an environment, not a screenshot

Build an AWS environment entirely with Terraform for a small learning platform.

### Requirements

- Network across two AZs with public and private subnets.
- Containerized web app or Lambda API behind a load balancer/API Gateway.
- Managed database with backups and deletion protection.
- S3 asset bucket with encryption and versioning.
- IAM roles with least privilege and no long-lived access keys.
- Logging, alarms, and at least one dashboard.
- Remote state with locking.
- A pipeline that validates, plans, and applies with approval.

### Deliverables

- Repository with README and architecture diagram
- Cost estimate for 1,000 daily active users
- RPO/RTO and tested restore notes
- A short threat model
- \`terraform destroy\` instructions

### Review

Trade review with another student. Look for hard-coded secrets, overly broad IAM, public resources, missing tags, and single points of failure. Leave at least three specific, actionable comments.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_cloud",
        title: "AWS Foundations Check",
        description:
          "Validate your understanding of regions, core services, resilience, and infrastructure as code.",
        type: "quiz",
        duration: 15,
        passScore: 70,
        status: "published",
        questions: [
          {
            prompt: "What is an AWS Availability Zone?",
            options: [
              "A billing group",
              "A physically separate data center group within a region",
              "A global content cache",
              "A type of IAM user",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which service provides durable object storage?",
            options: ["EC2", "S3", "RDS", "CloudFront"],
            correct: 1,
            points: 10,
          },
          {
            prompt: "A NAT gateway allows private subnet resources to initiate outbound internet traffic.",
            options: ["True", "False"],
            correct: 0,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "What does a Terraform plan show before apply?",
            options: [
              "Only resource costs",
              "Proposed changes between configuration, state, and reality",
              "A list of users",
              "The application's test results",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which pair defines recovery expectations?",
            options: ["CPU and memory", "RPO and RTO", "AZ and region", "IAM and KMS"],
            correct: 1,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_ml",
    slug: "machine-learning-foundations",
    title: "Machine Learning Foundations",
    subtitle:
      "Understand the algorithms behind modern AI — and build your first models.",
    description:
      "A rigorous but approachable introduction to machine learning. You will learn how models learn, how to evaluate them honestly, and how to avoid the traps that make impressive demos fail in production. By the end you will have trained, compared, and deployed a prediction service — with a clear understanding of its limits.",
    category: "Data & AI",
    level: "Intermediate",
    duration: 32,
    cover: "violet",
    status: "published",
    outcomes: [
      "Frame a real problem as a supervised learning task",
      "Explain the bias-variance trade-off in practical terms",
      "Train regression, classification, and tree-based models",
      "Evaluate models with metrics tied to real decisions",
      "Recognize leakage, unfairness, and distribution shift",
      "Deploy and monitor a simple prediction service",
    ],
    requirements: [
      "Comfort with Python and basic statistics",
      "Familiarity with pandas and NumPy",
      "High-school algebra; no calculus required",
    ],
    instructorId: "usr_mei",
    modules: [
      {
        title: "Learning from Data",
        summary: "Build the foundations: problem framing, generalization, and honest testing.",
        lessons: [
          {
            title: "The machine learning workflow",
            summary:
              "From a vague business problem to a measurable prediction task.",
            kind: "reading",
            duration: 18,
            content: `## A model is a decision tool

Machine learning finds patterns in examples and uses them to make predictions on new data. Before choosing an algorithm, define the decision the prediction will support.

### The workflow

1. **Frame the problem** — what decision changes based on the output?
2. **Define the target** — what exactly are we predicting, and when?
3. **Collect data** — is it representative of deployment?
4. **Split** — keep a test set untouched.
5. **Baseline** — simple rule or majority class.
6. **Iterate** — features, models, validation.
7. **Evaluate** — metrics tied to costs.
8. **Deploy and monitor** — behavior changes over time.

### Prediction vs causation

A model can predict churn without explaining why customers leave. If the decision is *what intervention helps*, prediction alone is not enough.

> Write a one-sentence problem statement with a metric and a time horizon before writing code. "Predict a 0.7 probability of churn within 30 days" is testable. "Understand customers" is not.`,
          },
          {
            title: "Bias, variance, and honest evaluation",
            summary:
              "Why good training scores can hide bad models — and how to split properly.",
            kind: "reading",
            duration: 22,
            content: `## Generalization is the whole game

- **Underfitting (high bias):** the model is too simple to capture the pattern.
- **Overfitting (high variance):** the model memorizes training noise and fails on new data.

A model with 99% training accuracy and 61% test accuracy has not learned; it has memorized.

### Splitting discipline

Use training data to fit, validation data to choose, and test data once to estimate final performance. When observations are grouped or time-ordered, random splitting leaks information. Split by customer, by store, or by time.

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit

for train_idx, val_idx in TimeSeriesSplit(n_splits=5).split(X):
    model.fit(X.iloc[train_idx], y.iloc[train_idx])
    score = model.score(X.iloc[val_idx], y.iloc[val_idx])
\`\`\`

### Cross-validation

Estimates vary. Report a mean and a spread, and inspect per-fold results for instability. A model that performs well on four folds and badly on one may be fragile in a specific segment.

Choose metrics before modeling. Changing them afterward is how teams convince themselves.`,
          },
          {
            title: "Lab: Build a baseline model",
            summary:
              "Create a simple, reproducible benchmark that any future model must beat.",
            kind: "lab",
            duration: 45,
            content: `## Establish the floor

Use the provided loan-default dataset.

### Tasks

1. Define the positive class and the cost of a false positive versus a false negative.
2. Split into train, validation, and test sets without leakage.
3. Build the simplest possible baseline: predict the majority class.
4. Build a logistic regression baseline with basic preprocessing.
5. Report accuracy, precision, recall, F1, and ROC AUC.
6. Explain which metric best matches the decision.

### Requirements

- All preprocessing lives inside a scikit-learn Pipeline.
- No test-set peeking.
- One command reproduces results.
- A short note on class imbalance and how it affects your interpretation.

### Reflection

Would a 2% improvement in recall justify deploying the model? What else would you need to know? Baselines are not demos. They are a contract about what "better" means.`,
          },
        ],
      },
      {
        title: "Core Algorithms",
        summary: "Know what each family of models is good at — and when not to use it.",
        lessons: [
          {
            title: "Regression and classification",
            summary:
              "Linear and logistic models, regularization, and the value of interpretability.",
            kind: "reading",
            duration: 24,
            content: `## Simple does not mean weak

**Linear regression** predicts a continuous value by fitting a weighted sum of features. **Logistic regression** predicts a probability for a binary outcome.

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

clf = make_pipeline(
    StandardScaler(),
    LogisticRegression(C=0.5, class_weight="balanced", max_iter=1000),
)
clf.fit(X_train, y_train)
\`\`\`

### Regularization

L2 regularization shrinks large coefficients to reduce overfitting. L1 can drive coefficients to zero, performing feature selection. The strength \`C\` controls the trade-off. Tune it with cross-validation.

### Why start here

Linear models are fast, stable, inspectable, and often surprisingly competitive on tabular data. Their coefficients give a sanity check that complex models cannot. If a gradient-boosted model finds signal a linear model cannot, that is a clue — not proof.

### Watch for

Scaling requirements, correlated features, nonlinear relationships, and the difference between a coefficient's direction and its causal effect.`,
          },
          {
            title: "Trees, forests, and boosting",
            summary:
              "The workhorses of tabular machine learning, and their failure modes.",
            kind: "reading",
            duration: 25,
            content: `## Splits all the way down

A decision tree partitions data with a sequence of yes/no questions. A single tree is interpretable but unstable. An ensemble reduces variance.

### Random forests

Many trees trained on bootstrap samples and random feature subsets, then averaged. Strong defaults, resilient to feature scaling, resistant to overfitting with enough trees.

### Gradient boosting

Trees are added sequentially, each correcting the previous ensemble's errors. Often the strongest model on tabular data, but easier to overfit and slower to train.

\`\`\`python
from sklearn.ensemble import HistGradientBoostingClassifier

model = HistGradientBoostingClassifier(
    learning_rate=0.06,
    max_iter=400,
    early_stopping=True,
    validation_fraction=0.15,
    random_state=42,
)
\`\`\`

### Failure modes

Trees struggle to extrapolate beyond training ranges. Deep trees memorize. Feature importance can be misleading when features are correlated. Use permutation importance or SHAP with care, and always evaluate on held-out data.

Start with a forest. Reach for boosting when you have the validation discipline to tune it.`,
          },
          {
            title: "Lab: Compare three models",
            summary:
              "Run a fair model comparison and defend the winner on more than accuracy.",
            kind: "lab",
            duration: 55,
            content: `## Create a comparison table you trust

Using the loan-default dataset, compare:

1. Logistic regression
2. Random forest
3. Histogram gradient boosting

### Protocol

- Same train/validation/test split for all models.
- Same preprocessing within each pipeline.
- Use 5-fold cross-validation on the training set.
- Tune at most three hyperparameters per model.
- Report mean and standard deviation for precision, recall, F1, and ROC AUC.
- Measure training time and inference time.

### Choose a winner

Write a short decision memo with:

- The metric that matters and why.
- The performance difference in business terms.
- The complexity and maintenance cost.
- The calibration of predicted probabilities.
- One failure mode you observed.

### Stretch goal

Plot a precision-recall curve and choose a threshold based on the relative cost of false positives and false negatives. Explain the threshold to a non-technical reader.`,
          },
        ],
      },
      {
        title: "Responsible ML",
        summary: "Build systems that earn trust after the notebook is closed.",
        lessons: [
          {
            title: "Features, fairness, and leakage",
            summary:
              "The ethical and technical traps hidden in the data you choose.",
            kind: "reading",
            duration: 22,
            content: `## Models inherit our choices

Training data reflects the world that produced it. If a group was underrepresented or historically disadvantaged by a process, a model can encode and amplify that pattern.

### Investigate before optimizing

- Who is in the data, and who is missing?
- Is the target a proxy for a protected trait?
- Does a feature encode a decision that was itself biased?
- Do error rates differ across groups?

A model can be accurate overall and harmful for a subgroup. Break down metrics by relevant segments, with confidence intervals.

### Leakage beyond the obvious

Target leakage includes features created after the outcome, but also proxies like a cancellation reason or a support ticket that references the event. Ask: *would this value exist at prediction time in the real workflow?*

### Mitigation is not always technical

Sometimes the right response is to remove a feature, change the decision threshold for a group, collect better data, or not deploy. Document the choice and its rationale. Fairness is a product decision with technical evidence, not a metric you optimize once.`,
          },
          {
            title: "Deploying and monitoring models",
            summary:
              "Serve predictions, watch for drift, and know when to retrain.",
            kind: "reading",
            duration: 20,
            content: `## A model in production is a living dependency

Deployment introduces latency, failures, and a changing world. The model that earned a good test score is not guaranteed to keep it.

### Serving patterns

- **Batch:** score everyone nightly; simple and easy to audit.
- **Real-time:** score per request; lower latency, more operational complexity.
- **Streaming:** score events continuously; useful for fraud and recommendations.

Start with the simplest pattern that meets the decision's timing requirement.

### Monitor four layers

1. **Service:** latency, errors, throughput.
2. **Inputs:** missing fields, range violations, schema changes.
3. **Predictions:** score distribution, positive rate.
4. **Outcomes:** delayed labels, accuracy, subgroup performance.

\`\`\`text
Alert: positive rate moves more than 2 std devs from baseline
Alert: >1% of requests have missing tenure_months
Review: retrain when rolling AUC drops below 0.72
\`\`\`

### Retraining is a release

Version data, code, and artifacts. Evaluate the new model on a holdout and compare against the live model. Roll out gradually. Keep a rollback path.`,
          },
          {
            title: "Capstone: Ship a prediction service",
            summary:
              "Package a model behind an API, document its behavior, and monitor it.",
            kind: "lab",
            duration: 140,
            content: `## From notebook to product

Choose one of the provided datasets and deliver a prediction service.

### Required components

- Reproducible training pipeline with a saved model artifact.
- A small API with \`/health\` and \`/predict\` endpoints.
- Input validation and a clear error contract.
- Model card: intended use, training data, metrics, limitations, fairness notes.
- Tests for preprocessing, prediction shape, and invalid input.
- Monitoring plan with at least four signals and alert thresholds.
- A 3-minute demo for a non-technical stakeholder.

### Quality bar

- Predictions are deterministic for the same input.
- No secrets in the repository.
- The API starts in a clean environment from documented steps.
- The model card is honest about what the model cannot do.

### Final reflection

What would you need to learn before this model could influence a real decision? Write five sentences. The ability to name uncertainty is a professional skill, not a weakness.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_ml",
        title: "ML Concepts Check",
        description:
          "Test your grasp of generalization, model families, evaluation, and responsible deployment.",
        type: "quiz",
        duration: 15,
        passScore: 75,
        status: "published",
        questions: [
          {
            prompt: "A model with 99% training accuracy and 60% validation accuracy is likely:",
            options: ["Underfit", "Overfit", "Perfectly calibrated", "Causally valid"],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Why is a test set kept untouched until the end?",
            options: [
              "To reduce training time",
              "To provide an unbiased estimate of final performance",
              "To increase the number of features",
              "To avoid using cross-validation",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Target leakage can make model performance look better than it will be in production.",
            options: ["True", "False"],
            correct: 0,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "Which family is often strongest on tabular data?",
            options: [
              "Convolutional networks",
              "Gradient-boosted trees",
              "K-means clustering",
              "Principal component analysis",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which is a production monitoring signal for a model?",
            options: [
              "Only the training loss",
              "Prediction score distribution over time",
              "The number of notebook cells",
              "The model's filename",
            ],
            correct: 1,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_frontend",
    slug: "frontend-ux-design-systems",
    title: "Frontend UX & Design Systems",
    subtitle:
      "Craft interfaces people love, with research, systems thinking, and sharp visual judgement.",
    description:
      "Great frontend work is more than clean code. This course connects product thinking, accessible design, and component systems so you can make interface decisions with confidence. You will audit real screens, build a reusable token-based component library, and cap the course with a polished product slice that works for every user.",
    category: "Web Development",
    level: "Beginner",
    duration: 20,
    cover: "lime",
    status: "published",
    outcomes: [
      "Apply hierarchy, spacing, type, and color with intent",
      "Turn product requirements into clear user flows",
      "Build and document a reusable component system",
      "Meet WCAG accessibility requirements in practice",
      "Prototype and test an interface with real users",
      "Present design decisions with evidence",
    ],
    requirements: [
      "Basic HTML and CSS",
      "Figma account (free tier is fine)",
      "A willingness to critique your own work",
    ],
    instructorId: "usr_daniel",
    modules: [
      {
        title: "Design Foundations",
        summary: "Train the visual judgement that makes interfaces feel effortless.",
        lessons: [
          {
            title: "Visual hierarchy and spacing",
            summary:
              "Use scale, contrast, and rhythm to tell people where to look.",
            kind: "reading",
            duration: 16,
            content: `## The eye needs a path

Hierarchy is the order in which a screen is understood. You create it with size, weight, contrast, spacing, and position. If everything is emphasized, nothing is.

### Start with spacing

Use a scale: 4, 8, 12, 16, 24, 32, 48, 64. Related elements sit closer together; unrelated elements get more room. Most "bad layouts" are really unresolved spacing.

\`\`\`css
.card {
  padding: 24px;
  display: grid;
  gap: 12px;
}
.card__title { margin: 0 0 4px; font-size: 1.125rem; }
.card__meta { color: var(--muted); font-size: 0.875rem; }
\`\`\`

### One primary action

Each screen should have a clear next step. Secondary actions can exist, but they should not compete visually. Muted text, borders, and whitespace are tools for de-emphasizing.

### Test with a squint

Step back or blur the screen. Can you still identify the title, the primary action, and the grouping? If not, the hierarchy needs work before the color does.`,
          },
          {
            title: "Typography and color systems",
            summary:
              "Build a small, coherent language instead of collecting pretty values.",
            kind: "reading",
            duration: 18,
            content: `## Constraints create coherence

A type system usually needs one display face, one body face, and a clear scale. A color system needs semantic roles, not a pile of hex codes.

### Type tokens

\`\`\`css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-2xl: 1.75rem;
  --text-4xl: 2.75rem;
}
\`\`\`

Line length should sit around 45–75 characters for reading. Tighten line height for headings and loosen it for paragraphs.

### Semantic color

Name color by purpose: \`--surface\`, \`--text\`, \`--muted\`, \`--primary\`, \`--success\`, \`--danger\`. A rebrand then changes tokens, not hundreds of components.

Check contrast: 4.5:1 for normal text and 3:1 for large text under WCAG AA. Never use color alone to communicate status.

> **Constraint:** design the whole screen with two neutrals, one accent, and a semantic success color. If it still works, you have a system.`,
          },
          {
            title: "Lab: Redesign a broken screen",
            summary:
              "Diagnose a deliberately chaotic dashboard, then rebuild its hierarchy.",
            kind: "lab",
            duration: 45,
            content: `## Repair before you decorate

You are given a screenshot and source code for a dashboard with no hierarchy: five competing buttons, inconsistent spacing, tiny muted labels, and three accent colors.

### Process

1. Write a one-sentence purpose for the screen.
2. Identify the primary action and the three most important facts.
3. Sketch two layout options on paper.
4. Rebuild one option with a spacing scale and type scale.
5. Remove at least 30% of the visual elements.
6. Test at 360px and 1440px.

### Deliverable

- Before and after screenshots
- A short rationale covering hierarchy, spacing, type, and color
- A list of what you removed and why

### Critique prompt

Swap with a partner. Ask them to find the primary action within three seconds without explanation. If they hesitate, the hierarchy is not finished.`,
          },
        ],
      },
      {
        title: "Systems Thinking",
        summary: "Design once, use everywhere — without turning every page into the same page.",
        lessons: [
          {
            title: "Design tokens and components",
            summary:
              "Build a component library that stays flexible under real product pressure.",
            kind: "reading",
            duration: 20,
            content: `## Tokens are the contract

A design token is a named decision: \`color.action.primary\`, \`space.4\`, \`radius.md\`. Components consume tokens instead of hard-coded values.

### Component anatomy

A button has a job, states, and constraints:

- Default, hover, focus, active, disabled, loading
- Primary, secondary, ghost
- Small, medium, large
- Icon support without breaking alignment

\`\`\`tsx
type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
\`\`\`

### Document behavior, not just appearance

A useful component page shows when to use it, when not to, keyboard behavior, loading patterns, and content guidance.

### Avoid over-abstraction

If two things look similar but behave differently, keep them separate. A shared component should share a decision, not merely a color.`,
          },
          {
            title: "Accessibility by default",
            summary:
              "Practical semantics, focus, contrast, and motion habits that include everyone.",
            kind: "reading",
            duration: 22,
            content: `## Accessibility is a quality bar

Accessible interfaces are easier for everyone: clearer labels, better keyboard flow, resilient structure.

### The daily checklist

- Use semantic HTML first: \`button\`, \`a\`, \`nav\`, \`main\`, headings in order.
- Label every input. Placeholders are not labels.
- Ensure visible focus styles on every interactive element.
- Maintain 4.5:1 text contrast (3:1 for large text).
- Do not rely on color alone for status.
- Respect \`prefers-reduced-motion\`.
- Announce dynamic errors near the field and to assistive technology.

\`\`\`tsx
<label htmlFor="email">Email address</label>
<input id="email" name="email" type="email" aria-describedby="email-error" />
<p id="email-error" role="alert">Enter a valid email address.</p>
\`\`\`

### Test with real constraints

Navigate with only a keyboard. Zoom to 200%. Use a screen reader for one flow. Test with reduced motion enabled. Automated audits help, but they cannot tell you whether the experience makes sense.`,
          },
          {
            title: "Lab: Build an accessible component",
            summary:
              "Implement, document, and test a reusable component with every state covered.",
            kind: "lab",
            duration: 50,
            content: `## Ship one component properly

Choose a combobox, tabs, or a dialog. Build it from scratch in React and TypeScript.

### Requirements

- Full keyboard support
- Correct ARIA only where native semantics fall short
- Visible focus states
- Loading, empty, error, and disabled states
- Reduced-motion support
- Unit tests for behavior, not snapshots
- A documentation page with usage guidance

### Accessibility tests

1. Complete the primary flow with the keyboard only.
2. Run axe or an equivalent automated audit.
3. Check contrast in every state.
4. Zoom the page to 200% and confirm no content is clipped.
5. Test with a screen reader and record what is announced.

### Stretch goal

Add the component to a small design-system documentation site with tokens and live examples. Write a short "when not to use this" section. Good documentation prevents misuse better than good intentions.`,
          },
        ],
      },
      {
        title: "Product Craft",
        summary: "Connect interface decisions to user needs, evidence, and delivery.",
        lessons: [
          {
            title: "Research and user flows",
            summary:
              "Ask better questions and map the path from intent to outcome.",
            kind: "reading",
            duration: 18,
            content: `## Understand the job, not the feature request

Users rarely ask for the right solution. They describe a friction point. Your job is to understand the job they are trying to complete.

### Five useful questions

1. What were you trying to do?
2. What did you expect to happen?
3. What actually happened?
4. What did you do next?
5. What would have made this easier?

Avoid leading questions and hypotheticals. Observe behavior when possible.

### Map the flow

A user flow is the sequence of steps, decisions, and system states between intent and outcome. Map the happy path, then the branches: empty state, error, no permission, slow network, interrupted session.

\`\`\`text
Discover course → View curriculum → Create account → Enroll
   → Start lesson → Resume later → Complete → Take assessment
\`\`\`

Mark the moments of highest uncertainty. Those are where clarity and reassurance matter most.

> A beautiful screen that answers the wrong question is still a bad screen.`,
          },
          {
            title: "Prototyping and handoff",
            summary:
              "Prototype the riskiest assumption, then communicate decisions engineers can build.",
            kind: "reading",
            duration: 17,
            content: `## Fidelity should match uncertainty

Use paper sketches for structure, interactive prototypes for flow, and production code for details that cannot be judged any other way. Higher fidelity is not automatically better.

### Test the riskiest thing

If the risk is *will users understand the enrollment options?*, test that before polishing icons. Write the hypothesis: "New students will choose the cohort track without help." Define what success looks like.

### Handoff is a conversation

A good handoff includes:

- The user problem and success metric
- Flows for empty, loading, error, and edge states
- Component mapping and token usage
- Copy with tone and constraints
- Accessibility notes and keyboard behavior
- Open questions and decision owners

\`\`\`text
Screen: Course enrollment
States: default, already enrolled, pending approval, payment failed
Breakpoints: 360, 768, 1200
Focus order: heading → curriculum → enroll CTA → help
\`\`\`

The goal is shared understanding, not a pixel-perfect file.`,
          },
          {
            title: "Capstone: Design a product slice",
            summary:
              "Research, design, build, and test one complete product flow.",
            kind: "lab",
            duration: 125,
            content: `## One slice, done well

Choose one flow from BrighterFuture: enrollment, lesson learning, assessment results, or instructor analytics.

### Deliverables

1. A short research summary from at least three people.
2. A user flow covering happy path and four edge states.
3. Low-fidelity sketches and one rejected direction.
4. A high-fidelity responsive prototype.
5. A functional front-end slice using your component system.
6. Accessibility test results.
7. A five-minute presentation connecting evidence to decisions.

### Quality bar

- The primary action is unmistakable.
- Every state is designed, including empty and error.
- Keyboard and screen reader paths are documented.
- Copy is clear and specific.
- The visual system is consistent with the BrighterFuture brand.

### Present

Start with the user problem, not the screens. Show what you learned, what you changed, and what you would test next. Strong product work explains its evidence.`,
          },
        ],
      },
    ],
    assessments: [
      {
        id: "asm_ux",
        title: "UX & Accessibility Check",
        description:
          "A quick check on hierarchy, design systems, accessibility, and evidence-led product work.",
        type: "quiz",
        duration: 10,
        passScore: 70,
        status: "published",
        questions: [
          {
            prompt: "What is the fastest way to improve an unclear layout?",
            options: [
              "Add more accent colors",
              "Resolve grouping and spacing first",
              "Increase all font sizes",
              "Add more buttons",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "What is the minimum WCAG AA contrast ratio for normal text?",
            options: ["2:1", "3:1", "4.5:1", "7:1"],
            correct: 2,
            points: 10,
          },
          {
            prompt: "A placeholder is an acceptable replacement for a visible input label.",
            options: ["True", "False"],
            correct: 1,
            points: 10,
            type: "true_false",
          },
          {
            prompt: "Why are design tokens useful?",
            options: [
              "They make pages load faster",
              "They name reusable decisions so systems stay consistent",
              "They replace accessibility testing",
              "They eliminate the need for components",
            ],
            correct: 1,
            points: 10,
          },
          {
            prompt: "Which state is most often forgotten in handoff?",
            options: ["Default", "Empty or error state", "Brand colors", "Desktop layout"],
            correct: 1,
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "crs_devops",
    slug: "docker-and-cicd",
    title: "Docker & CI/CD in Practice",
    subtitle:
      "Package, test, and ship applications with repeatable pipelines.",
    description:
      "A hands-on introduction to containers and delivery automation. Build small images, run services locally, create a test pipeline, and deploy with confidence. This course is currently being prepared and is not open for enrollment yet.",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: 18,
    cover: "ember",
    status: "draft",
    outcomes: [
      "Containerize a web application with a minimal image",
      "Compose multi-service environments for local development",
      "Automate tests and builds in a CI pipeline",
      "Deploy a container with health checks and rollback",
    ],
    requirements: ["Basic command line", "Familiarity with Git"],
    instructorId: "usr_zara",
    modules: [
      {
        title: "Containers from First Principles",
        summary: "Images, layers, and the mental model behind Docker.",
        lessons: [
          {
            title: "Images, containers, and layers",
            summary:
              "Understand what is actually running when you start a container.",
            kind: "reading",
            duration: 15,
            content: `## A container is a packaged process

A Docker **image** is an immutable filesystem plus metadata. A **container** is a running instance of an image, isolated with Linux namespaces and constrained with cgroups.

Images are built from layers. Each instruction adds a layer, and layers are cached. Put frequently changing steps last to keep rebuilds fast.

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

Containers are disposable. Store data in volumes or a database, never inside the writable container layer. Keep images small, run as a non-root user, and pin base image versions.

This draft lesson is part of an upcoming course.`,
          },
        ],
      },
    ],
    assessments: [],
  },
];
