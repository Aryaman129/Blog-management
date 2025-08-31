
import { BlogPost, Project } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Modern React Applications with TypeScript',
    excerpt: 'Learn how to leverage TypeScript in React applications for better development experience and type safety.',
    content: `# Building Modern React Applications with TypeScript

TypeScript has become an essential tool for React developers, providing static type checking and enhanced developer experience. In this comprehensive guide, we'll explore how to build robust React applications with TypeScript.

## Why TypeScript with React?

TypeScript offers several advantages when building React applications:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete and refactoring capabilities
- **Improved Documentation**: Types serve as documentation for your code
- **Easier Refactoring**: Safe and confident code changes

## Setting Up Your Project

\`\`\`bash
npx create-react-app my-app --template typescript
# or
npm create vite@latest my-app -- --template react-ts
\`\`\`

## Component Type Patterns

### Functional Components

\`\`\`tsx
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};
\`\`\`

This is just the beginning of mastering TypeScript with React. Stay tuned for more advanced patterns!`,
    author: 'Alex Johnson',
    date: '2024 Dec 28',
    readTime: '8 min read',
    category: 'Development',
    tags: ['React', 'TypeScript', 'Frontend', 'Web Development'],
    image: '/api/placeholder/800/400',
    featured: true
  },
  {
    id: '2',
    title: 'The Future of Web Design: Trends to Watch in 2024',
    excerpt: 'Explore the latest design trends that are shaping the future of web experiences.',
    content: `# The Future of Web Design: Trends to Watch in 2024

The web design landscape is constantly evolving, driven by new technologies, user expectations, and creative innovations. As we move through 2024, several key trends are emerging that will shape how we design and build web experiences.

## 1. AI-Powered Design Tools

Artificial intelligence is revolutionizing the design process:

- **Automated Layout Generation**: AI tools can generate layout variations
- **Color Palette Suggestions**: Smart color recommendations based on brand and content
- **Content-Aware Design**: Designs that adapt to content automatically

## 2. Immersive 3D Experiences

Three-dimensional elements are becoming more accessible:

- **WebGL Integration**: Smooth 3D graphics in browsers
- **AR/VR Elements**: Augmented reality components for enhanced interaction
- **3D Product Showcases**: Interactive product demonstrations

## 3. Sustainable Web Design

Environmental consciousness is influencing design decisions:

- **Performance Optimization**: Reducing energy consumption through efficient code
- **Minimalist Aesthetics**: Less is more for both user experience and environment
- **Green Hosting**: Choosing eco-friendly hosting solutions

The future of web design is bright, with endless possibilities for creativity and innovation!`,
    author: 'Sarah Chen',
    date: '2024 Dec 25',
    readTime: '6 min read',
    category: 'Design',
    tags: ['Web Design', 'Trends', 'UI/UX', '2024'],
    image: '/api/placeholder/800/400'
  },
  {
    id: '3',
    title: 'Mastering CSS Grid: Advanced Layout Techniques',
    excerpt: 'Deep dive into CSS Grid with practical examples and advanced layout patterns.',
    content: `# Mastering CSS Grid: Advanced Layout Techniques

CSS Grid has revolutionized how we approach web layouts, offering unprecedented control over two-dimensional designs. Let's explore advanced techniques that will elevate your layout skills.

## Understanding Grid Areas

Grid areas allow you to name sections of your layout for easier management:

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid Patterns

Create responsive layouts without media queries:

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## Advanced Grid Functions

- **minmax()**: Set minimum and maximum sizes
- **clamp()**: Responsive sizing with constraints
- **auto-fit vs auto-fill**: Understanding the difference

Master these techniques and you'll have powerful tools for creating complex, responsive layouts!`,
    author: 'Michael Rodriguez',
    date: '2024 Dec 20',
    readTime: '10 min read',
    category: 'Development',
    tags: ['CSS', 'Grid', 'Layout', 'Frontend'],
    image: '/api/placeholder/800/400'
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform with Next.js',
    description: 'A full-stack e-commerce solution built with Next.js, featuring user authentication, payment processing, and admin dashboard.',
    content: `# E-Commerce Platform with Next.js

This project showcases a complete e-commerce solution built with modern web technologies. The platform includes user authentication, product management, shopping cart functionality, and payment processing.

## Key Features

- **User Authentication**: Secure login and registration system
- **Product Catalog**: Dynamic product listings with search and filtering
- **Shopping Cart**: Persistent cart with local storage
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Content management system for products and orders
- **Responsive Design**: Mobile-first approach with modern UI

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe API
- **Deployment**: Vercel

## Challenges & Solutions

One of the main challenges was implementing real-time inventory management. I solved this by implementing optimistic updates with proper error handling and rollback mechanisms.

The payment flow required careful consideration of security and user experience, resulting in a seamless checkout process that handles various payment scenarios.

## Results

The platform handles thousands of concurrent users and processes payments reliably. The admin dashboard provides comprehensive analytics and inventory management capabilities.`,
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    date: '2024 Dec 15',
    status: 'completed',
    category: 'Full Stack',
    image: '/api/placeholder/800/600',
    demoUrl: 'https://ecommerce-demo.example.com',
    githubUrl: 'https://github.com/username/ecommerce-platform',
    featured: true
  },
  {
    id: '2',
    title: 'AI-Powered Task Management App',
    description: 'A smart task management application that uses AI to prioritize tasks and suggest optimal scheduling.',
    content: `# AI-Powered Task Management App

This innovative task management application leverages artificial intelligence to help users optimize their productivity through intelligent task prioritization and scheduling suggestions.

## Core Features

- **Smart Task Prioritization**: AI algorithms analyze task importance and deadlines
- **Schedule Optimization**: Suggests optimal time slots based on your productivity patterns
- **Natural Language Processing**: Add tasks using natural language
- **Productivity Analytics**: Detailed insights into your work patterns
- **Team Collaboration**: Share projects and collaborate with team members
- **Cross-Platform Sync**: Available on web, mobile, and desktop

## AI Implementation

The AI system uses machine learning models to:

1. **Analyze Task Complexity**: Estimate time requirements based on task description
2. **Personal Pattern Recognition**: Learn your productivity patterns over time
3. **Priority Scoring**: Dynamic priority scoring based on multiple factors
4. **Intelligent Reminders**: Send reminders at optimal times

## Technical Implementation

- **Frontend**: React Native for mobile, Electron for desktop
- **Backend**: Node.js with Express, Python for ML models
- **AI/ML**: TensorFlow, Natural Language Processing APIs
- **Database**: MongoDB for flexibility with unstructured data
- **Real-time**: WebSocket connections for live updates

## Impact

Users report a 40% increase in task completion rates and better work-life balance through optimized scheduling.`,
    technologies: ['React Native', 'Node.js', 'Python', 'TensorFlow', 'MongoDB', 'WebSocket'],
    date: '2024 Nov 20',
    status: 'completed',
    category: 'Mobile App',
    image: '/api/placeholder/800/600',
    demoUrl: 'https://ai-tasks-demo.example.com',
    githubUrl: 'https://github.com/username/ai-task-manager',
    featured: true
  },
  {
    id: '3',
    title: 'Real-time Collaboration Whiteboard',
    description: 'A collaborative digital whiteboard application with real-time synchronization and advanced drawing tools.',
    content: `# Real-time Collaboration Whiteboard

This project implements a sophisticated digital whiteboard that enables real-time collaboration between multiple users, featuring advanced drawing tools and seamless synchronization.

## Features

- **Real-time Collaboration**: Multiple users can draw simultaneously
- **Advanced Drawing Tools**: Brushes, shapes, text, sticky notes
- **Infinite Canvas**: Zoom and pan across unlimited space
- **Version History**: Track changes and revert to previous versions
- **Export Options**: Save as PNG, PDF, or SVG
- **Room Management**: Create private or public collaboration rooms

## Technical Challenges

### Real-time Synchronization
Implementing conflict-free replicated data types (CRDTs) to ensure consistent state across all clients without conflicts.

### Performance Optimization
Handling thousands of drawing operations while maintaining smooth 60fps performance through canvas optimization and efficient data structures.

### Scalability
Designing the system to handle hundreds of concurrent collaborators per room using WebSocket clustering and Redis for state management.

## Architecture

- **Frontend**: React with HTML5 Canvas API
- **Real-time Engine**: Socket.io with clustering support
- **State Management**: Zustand with CRDT implementation
- **Backend**: Node.js with Express
- **Database**: Redis for real-time state, PostgreSQL for persistence
- **Deployment**: Docker containers with Kubernetes orchestration

## Results

The application successfully handles 500+ concurrent users per room with sub-100ms latency for drawing operations.`,
    technologies: ['React', 'Socket.io', 'Canvas API', 'Node.js', 'Redis', 'PostgreSQL', 'Docker'],
    date: '2024 Oct 10',
    status: 'completed',
    category: 'Web App',
    image: '/api/placeholder/800/600',
    demoUrl: 'https://whiteboard-demo.example.com',
    githubUrl: 'https://github.com/username/collaborative-whiteboard'
  }
];

export const allContent = [
  ...blogPosts.map(post => ({ ...post, type: 'blog' as const })),
  ...projects.map(project => ({ ...project, type: 'project' as const }))
];
