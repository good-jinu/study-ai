# UI Components

This directory contains reusable UI components that can be used throughout the application.

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// As child (for Link components)
<Button asChild>
  <Link href="/somewhere">Go somewhere</Link>
</Button>
```

### Input & Textarea
Form input components with consistent styling.

```tsx
import { Input, Textarea } from "@/components/ui";

<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Enter email" error />
<Textarea rows={4} placeholder="Enter description" />
```

### Select
Dropdown select component.

```tsx
import { Select } from "@/components/ui";

<Select value={value} onChange={handleChange}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
```

### Label
Form label component with optional required indicator.

```tsx
import { Label } from "@/components/ui";

<Label htmlFor="input-id">Field Name</Label>
<Label htmlFor="input-id" required>Required Field</Label>
```

### FormField & FormSection
Layout components for organizing forms.

```tsx
import { FormField, FormSection, Label, Input } from "@/components/ui";

<FormSection title="User Information">
  <FormField error="This field is required">
    <Label htmlFor="name" required>Name</Label>
    <Input id="name" type="text" />
  </FormField>
</FormSection>
```

### Card
Container component for content sections.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";

<Card>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge
Small status or category indicators.

```tsx
import { Badge } from "@/components/ui";

<Badge variant="default">Default</Badge>
<Badge variant="flashcard">Flashcard</Badge>
<Badge variant="quiz">Quiz</Badge>
<Badge variant="lesson">Lesson</Badge>
<Badge variant="summary">Summary</Badge>
```

### Alert
Message components for different states.

```tsx
import { Alert } from "@/components/ui";

<Alert variant="error">Something went wrong!</Alert>
<Alert variant="warning">Please be careful</Alert>
<Alert variant="info">Here's some information</Alert>
<Alert variant="success">Success!</Alert>
```

### IdleMotion
Animated loading indicator with customizable properties.

```tsx
import { IdleMotion } from "@/components/ui";

// Basic usage
<IdleMotion />

// With size variants
<IdleMotion size="sm" />
<IdleMotion size="md" />
<IdleMotion size="lg" />

// With custom pixel size
<IdleMotion size={32} />

// With speed control
<IdleMotion speed="slow" />
<IdleMotion speed="normal" />
<IdleMotion speed="fast" />

// Paused animation
<IdleMotion paused />

// With custom styling
<IdleMotion className="text-primary" />
```

## Content-Specific Components

### ContentTypeIndicator
Badge component for displaying content types with appropriate styling.

```tsx
import { ContentTypeIndicator } from "@/components/ui";

<ContentTypeIndicator type="flashcard" />
<ContentTypeIndicator type="quiz" />
<ContentTypeIndicator type="lesson" />
<ContentTypeIndicator type="summary" />
```

### DifficultyBadge
Styled badge for difficulty levels with color coding.

```tsx
import { DifficultyBadge } from "@/components/ui";

<DifficultyBadge difficulty="easy" />
<DifficultyBadge difficulty="medium" />
<DifficultyBadge difficulty="hard" />
```

### ContentHeader
Standardized header for content pages with title and type indicator.

```tsx
import { ContentHeader } from "@/components/ui";

<ContentHeader 
  title="Lesson Title" 
  type="lesson" 
  subtitle="Optional subtitle"
>
  <div>Additional header content</div>
</ContentHeader>
```

### ContentCard
Versatile card component for different content states.

```tsx
import { ContentCard } from "@/components/ui";

<ContentCard variant="question" onClick={handleClick}>
  Question content
</ContentCard>

<ContentCard variant="answer">
  Answer content
</ContentCard>

<ContentCard variant="success">
  Success feedback
</ContentCard>
```

### AnswerOption
Interactive quiz option component with selection states.

```tsx
import { AnswerOption } from "@/components/ui";

<AnswerOption
  option="Answer text"
  index={0}
  isSelected={false}
  isCorrect={true}
  isAnswered={false}
  onSelect={handleSelect}
/>
```

### FeedbackCard
Feedback display for quiz results with consistent styling.

```tsx
import { FeedbackCard } from "@/components/ui";

<FeedbackCard
  type="success"
  title="Correct!"
  explanation="Detailed explanation here"
/>

<FeedbackCard
  type="error"
  title="Incorrect"
  message="The correct answer is..."
  explanation="Why this is the correct answer"
/>
```

### KeyPointsList
Organized display of key points with bullet or numbered variants.

```tsx
import { KeyPointsList } from "@/components/ui";

<KeyPointsList
  points={["Point 1", "Point 2", "Point 3"]}
  title="Key Points"
  variant="bullets"
/>

<KeyPointsList
  points={keyTakeaways}
  title="Key Takeaways"
  variant="numbered"
/>
```

### ContentSection
Structured content section with consistent heading styles.

```tsx
import { ContentSection } from "@/components/ui";

<ContentSection heading="Section Title" headingLevel="h2">
  <p>Section content goes here</p>
</ContentSection>
```

### MetadataDisplay
Display component for content metadata (difficulty, subject, tags).

```tsx
import { MetadataDisplay } from "@/components/ui";

<MetadataDisplay 
  metadata={content.metadata} 
  position="relative" 
/>
```

## Usage Guidelines

1. **Import from index**: Always import components from `@/components/ui` to use the barrel exports.
2. **Consistent styling**: These components use design tokens from your CSS variables for consistent theming.
3. **Accessibility**: All components include proper ARIA attributes and keyboard navigation support.
4. **Customization**: Use the `className` prop to add additional styles when needed.
5. **TypeScript**: All components are fully typed with proper prop interfaces.

## Extending Components

To add new variants or modify existing ones, edit the component files directly. The components use a consistent pattern with:

- `cn()` utility for class merging
- `forwardRef` for proper ref forwarding
- Variant-based styling with clear type definitions
- Consistent prop interfaces extending HTML element props