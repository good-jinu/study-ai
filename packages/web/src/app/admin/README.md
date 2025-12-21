# StudyAI Admin Panel

The admin panel provides content creators with a comprehensive interface to manage study content for the StudyAI platform.

## Features

### Content Management
- **View All Content**: Browse all study content with filtering by type (flashcards, quizzes, lessons, summaries)
- **Create New Content**: Add new study materials with rich content forms
- **Edit Existing Content**: Update any piece of content with full editing capabilities
- **Delete Content**: Remove content with confirmation prompts

### Content Types Supported

1. **Flashcards**
   - Question and answer pairs
   - Optional hints
   - Perfect for memorization and quick review

2. **Quizzes**
   - Multiple choice questions with 4 options
   - Correct answer selection
   - Optional explanations for learning

3. **Lessons**
   - Multi-section structured content
   - Headings and detailed body text
   - Optional key points for summary

4. **Summaries**
   - Main summary text
   - Optional bullet points
   - Related topics for cross-referencing

### Metadata Support
- **Difficulty Levels**: Easy, Medium, Hard
- **Subject Classification**: Organize by academic subject
- **Tags**: Flexible tagging system for categorization

## Access

Navigate to `/admin` from the main application or click the settings icon in the top-right corner of the study interface.

## Usage

1. **Browse Content**: The main admin page shows all content in a card-based layout
2. **Filter by Type**: Use the dropdown to filter content by type
3. **Create New**: Click "Add Content" to create new study materials
4. **Edit**: Click the "Edit" button on any content card
5. **Delete**: Click the "Delete" button with confirmation

## Technical Details

- Built with Next.js App Router
- Server Actions for data mutations
- DynamoDB integration for persistence
- Responsive design with Tailwind CSS
- Type-safe with TypeScript