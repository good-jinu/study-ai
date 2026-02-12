# 🚀 [AI Office Worker Training Center] Integrated Planning Document (PRD)

## 1. Project Overview
### 1.1. Product Definition
**"AI Office Worker Training Center"** is a practical AI tool for office workers who encounter three frequent tasks (Emails, Meeting Minutes, Reports) but don't know complex prompt engineering. It helps solve these tasks immediately and accumulate experience for growth.

### 1.2. Core Values
- **Instant**: Use it immediately without learning.
- **Useful**: Results can be copy-pasted directly into work.
- **Achievement**: Your level increases as you solve tasks.

### 1.3. Target Persona
- **Name**: Minsu Kim (3rd-year Marketer)
- **Situation**: Spends too much time on emails, meeting notes, and report drafts.
- **Needs**: An easy AI tool to improve work efficiency immediately.

---

## 2. Detailed Requirements

### 2.1. Functional Requirements
| Category | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **Auth** | Easy Login | Google Login or Email login via NextAuth. | P0 |
| **Dashboard** | Mission Board | Display number of completed missions (out of 3) and current level. | P0 |
| **Mission 1** | Email Writing | Input: Raw content -> Output: Polite business email. | P0 |
| **Mission 2** | Meeting Summary | Input: Meeting notes -> Output: Summary of decisions and action items. | P0 |
| **Mission 3** | Report Draft | Input: Idea memo -> Output: Structured draft (Background-Problem-Solution). | P0 |
| **AI** | Prompting | Use OpenAI GPT-3.5-turbo. Fixed office-style tone and manner. | P0 |
| **Storage** | Result Saving | Save AI responses to DB for future reference. | P0 |

### 2.2. Non-Functional Requirements
- **Response Speed**: Loading animation during AI response generation.
- **Mobile Support**: Responsive web design.
- **Error Handling**: User-friendly messages for API failures.

---

## 3. Tech Stack and Data Structure

### 3.1. Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Next.js Server Actions / API Routes
- **Database**: AWS DynamoDB (via SST)
- **Auth**: NextAuth.js
- **AI**: OpenAI API (gpt-3.5-turbo)

### 3.2. Data Structure (DynamoDB)
- **Users Table**: `userId` (PK), `email`, `completedMissions` (List), `level`, `createdAt`
- **Missions Table**: `missionId` (PK), `title`, `description`, `promptSystem`, `uiConfig`
- **Submissions Table**: `submissionId` (PK), `userId` (GSI), `missionId`, `inputText`, `outputText`, `createdAt`
