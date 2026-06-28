
# AI Career Mentor Platform

An advanced, multi-modular AI-powered career mentorship and development ecosystem. This platform leverages modern web technologies and Artificial Intelligence to provide personalized career path roadmapping, skills analysis, resume/concept explanations, and interactive AI mentorship panels.

## 🚀 Platform Architecture

The repository is structured as a collection of specialized sub-platforms, each handling a distinct pillar of career development:

```
aditya-elite/ai-career-mentor-platform/
├── root/               # Main Entry point, Landing page & central Dashboard
├── dag/                # Interactive Career Path Roadmapping & Tracking Module
├── explainly/          # AI-powered concept explanations using Gemini API
└── nova/nova-app/      # Advanced AI Mentorship Hub, predictive readiness & reporting

```

---

## 📂 Modules Overview

### 1. 🏠 Main Platform Entry (`/`)

The primary gateway of the platform featuring an engaging landing page and high-level analytics dashboard.

* **Key Files:** `src/Landing.tsx`, `src/Dashboard.jsx`, `server.js`.


* **Tech Stack:** React, TypeScript, Tailwind CSS, Vite, Express.


* **Features:** Responsive landing page alongside a centralized user dashboard aggregating cross-module analytics.



### 2. 🗺️ Dag (Roadmap Module) (`/dag`)

Dedicated submodule focusing on multi-branch career progression visualization and tracking.

* **Key Files:** `src/RoadmapApp.jsx`, `src/RoadmapDash.jsx`, `ROADMAP.md`.


* **Tech Stack:** React (JSX), Vite, Custom CSS.


* **Features:** Dynamic career path node rendering with custom timeline progression tracking.



### 3. 💡 Explainly (AI Concept Simplifier) (`/explainly`)

A tailored workspace designed to break down complex technical fields into intuitive summaries using LLMs.

* **Key Files:** `src/services/geminiService.ts`, `src/App.tsx`.


* **Tech Stack:** React, TypeScript, Tailwind CSS, Vite, Google Gemini API.


* **Features:** Dynamic Gemini SDK wrapper logic designed for context-aware learning and definitions.



### 4. ✨ Nova AI Assistant Hub (`/nova/nova-app`)

The conversational engine and predictive diagnosis center of the platform.

* **Key Files:** `src/components/AssistantPanel.jsx`, `src/utils/predictionEngine.js`, `src/components/SkillHeatmap.jsx`.


* **Tech Stack:** React, Tailwind CSS, Shadcn UI Components.


* **Features:** Interactive mentor chat layout, data-driven visual skill matrices, and automated future readiness assessments.



---

## 🛠️ Global Tech Stack

* **Frontend Framework:** React 18 & Vite


* **Languages:** TypeScript & JavaScript (ES6+)


* **Styling Framework:** Tailwind CSS


* **UI Components:** Built utilizing **Shadcn UI** library paradigms (Accordions, Dialogs, Charts, Carousels, Forms)



---

## ⚙️ How to Run the Program

Because each package operates independently with its own configurations, you can run the primary application or navigate into individual sub-workspaces depending on your development requirements.

### Prerequisites

Ensure you have the following installed locally:

* **Node.js** (v18.0.0 or higher recommended)


* **npm** or **yarn** package manager



### Step 1: Clone and Install Dependencies

Open your terminal and clone the repository root to install base dependencies:

```bash
git clone https://github.com/aditya-elite/ai-career-mentor-platform.git
cd ai-career-mentor-platform
npm install

```

### Step 2: Running the Individual Submodules

#### 🔹 Running the Main Landing Application & Server

To start the primary dashboard ecosystem directly from the root environment:

```bash
# Start the local frontend development platform
npm run dev

# (Optional) To boot up the companion backend web server
node server.js

```

#### 🔹 Running Explainly (AI Concept Simplifier)

The Explainly app utilizes a Google Gemini AI backend configuration. Remember to supply your access token before spinning up the local port:

```bash
cd explainly

# Generate your environment configuration file from the provided example template
cp .env.example .env

# Open the new .env file and paste your valid Gemini API credentials
npm install
npm run dev

```

#### 🔹 Running the Nova AI Assistant Hub

To test the visual skill heatmaps and dynamic prediction modules:

```bash
cd nova/nova-app
npm install
npm run dev

```

#### 🔹 Running the Dag Milestones Application

To render and review individual milestone track branches:

```bash
cd dag
npm install
npm run dev

```

---


