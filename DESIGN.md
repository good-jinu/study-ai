# 🏗️ DESIGN.md: Project Structure and Change Design

## 1. Architecture Overview
Maintain the existing SST (AWS) + Next.js monorepo structure, updating the data model and interface to match the "AI Office Worker Training Center" concept.

## 2. Database Design (DynamoDB)
Define the following tables or extend existing ones using `sst.aws.Dynamo`.

### 2.1. UsersTable
- **Partition Key**: `userId` (string)
- **Attributes**:
    - `email`: string
    - `completedMissions`: string[] (List of completed mission IDs)
    - `level`: string (Beginner, Intern, Worker)
    - `createdAt`: string (ISO 8601)

### 2.2. MissionsTable
- **Partition Key**: `missionId` (string)
- **Attributes**:
    - `title`: string
    - `description`: string
    - `promptSystem`: string
    - `uiConfig`: map (icon, placeholder, etc.)

### 2.3. SubmissionsTable
- **Partition Key**: `submissionId` (string)
- **Global Secondary Index (GSI)**: `AuthorIndex` (Partition Key: `userId`, Sort Key: `createdAt`)
- **Attributes**:
    - `userId`: string
    - `missionId`: string
    - `inputText`: string
    - `outputText`: string
    - `createdAt`: string

## 3. Package-Specific Changes

### 3.1. `packages/db`
- Add `UserRepository`, `MissionRepository`, and `SubmissionRepository`.
- Implement CRUD logic for each table using DynamoDB SDK.

### 3.2. `packages/core`
- Define `User`, `Mission`, and `Submission` interfaces.
- `AIService`: Logic to process prompts by calling OpenAI API.

### 3.3. `packages/web`
- **Dashboard**: Visualize user's current level and mission progress.
- **Mission Page**: Input form and AI result display for each mission.
- **Auth**: Use NextAuth for session management and obtaining `userId`.

## 4. UI/UX Design Direction
- Modern and intuitive office theme using **Tailwind CSS**.
- Visual feedback/animations for leveling up.
- Skeleton UI or loading spinners for AI response wait times.
