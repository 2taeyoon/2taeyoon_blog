export type ShowcaseProjectId = "codex" | "claude" | "cursor";

export interface ShowcaseProjectStep {
  title: string;
  body: string;
}

export interface ShowcaseProject {
  id: ShowcaseProjectId;
  title: string;
  displayTitle: string;
  eyebrow: string;
  subtitle: string;
  stack: string;
  accentColor: string;
  image: string;
  browserPath: string;
  year: string;
  description: string;
  steps: ShowcaseProjectStep[];
  prompt: string;
  review: string;
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "codex",
    title: "Codex",
    displayTitle: "Codex",
    eyebrow: "Selected Work · 01",
    subtitle: "Agentic Engineering Workspace",
    stack: "Systems · Tools · Taste",
    accentColor: "#5a7fd4",
    image: "/images/portfolio/projects/project-codex.png",
    browserPath: "workspace / agentic-build",
    year: "2026",
    description:
      "Codex is an agentic coding workspace built to move from a clear intent to a verified change. It reads the repository, edits across files, runs the tools, and stays with the work until the result is ready to review.",
    steps: [
      {
        title: "Open a real repository",
        body: "Begin in the project you want to change, with its local instructions and existing work intact.",
      },
      {
        title: "Describe the outcome",
        body: "State the behavior you want, the constraints that matter, and what a convincing verification looks like.",
      },
      {
        title: "Let it inspect first",
        body: "Give Codex room to trace the relevant files, commands, and tests before it edits.",
      },
      {
        title: "Review the proof",
        body: "Read the diff and compare the reported checks with the change that was actually made.",
      },
    ],
    prompt:
      "Review this repository, identify the smallest safe change that solves [goal], implement it, run the relevant checks, and summarize the evidence.",
    review:
      "Confirm that unrelated files were preserved, the diff matches your intent, and every reported check is relevant to the change.",
  },
  {
    id: "claude",
    title: "Claude Code",
    displayTitle: "Claude Code",
    eyebrow: "Selected Work · 02",
    subtitle: "Context-aware Terminal Experience",
    stack: "Context · Craft · Care",
    accentColor: "#7c8fd4",
    image: "/images/portfolio/projects/project-claude.png",
    browserPath: "terminal / context-map",
    year: "2026",
    description:
      "Claude Code brings deliberate reasoning into the terminal. It follows context across a codebase, works carefully with files and tools, and turns complex implementation work into a calm, inspectable conversation.",
    steps: [
      {
        title: "Start at the project root",
        body: "Launch the session where the repository instructions, scripts, and source tree can all be discovered.",
      },
      {
        title: "Point to the code path",
        body: "Name the feature, file, error, or user journey that should anchor the investigation.",
      },
      {
        title: "Plan broad work",
        body: "For a larger change, ask for an inspectable plan before authorizing implementation.",
      },
      {
        title: "Keep the loop visible",
        body: "Watch the files, tool output, and assumptions as the conversation moves from diagnosis to verification.",
      },
    ],
    prompt:
      "Map the code path behind [feature], explain the current behavior, then implement the smallest safe change and verify it.",
    review:
      "Check the assumptions, tool output, edited files, and whether the final explanation accurately describes the code.",
  },
  {
    id: "cursor",
    title: "Cursor",
    displayTitle: "Cursor",
    eyebrow: "Selected Work · 03",
    subtitle: "Augmented Development Environment",
    stack: "Select · Predict · Refine",
    accentColor: "#e08850",
    image: "/images/portfolio/projects/project-cursor.png",
    browserPath: "editor / next-change",
    year: "2026",
    description:
      "Cursor places AI inside the editor itself, close to the code and the act of selection. It predicts the next change, reshapes whole files, and keeps the creative loop moving from prompt to production.",
    steps: [
      {
        title: "Open the working file",
        body: "Keep the implementation and its neighboring types, tests, or styles visible in the editor.",
      },
      {
        title: "Select useful context",
        body: "Highlight the smallest region that expresses the problem without hiding important dependencies.",
      },
      {
        title: "State the invariant",
        body: "Tell Cursor what must not change: behavior, public APIs, performance, accessibility, or visual rhythm.",
      },
      {
        title: "Apply in small passes",
        body: "Review each suggestion before accepting it, then run the checks closest to the edited code.",
      },
    ],
    prompt:
      "Refactor this component for clarity without changing behavior. Preserve its public API and update the relevant tests.",
    review:
      "Inspect every suggested edit, run the affected tests, and reject any change that weakens the invariant.",
  },
];
