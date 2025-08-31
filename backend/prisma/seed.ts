import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';
import { generateSlug, calculateReadTime } from '../src/utils/helpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await hashPassword('admin123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create tags
  const tags = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 
    'Tailwind CSS', 'CSS Grid', 'Web Development', 'Frontend', 'Backend',
    'Full Stack', 'API', 'Database', 'Authentication', 'Docker', 'AWS',
    'JavaScript', 'HTML', 'CSS', 'Express', 'MongoDB', 'GraphQL',
    'Redux', 'Zustand', 'Socket.io', 'Redis', 'Kubernetes', 'CI/CD'
  ];

  const createdTags = [];
  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: generateSlug(tagName),
      },
    });
    createdTags.push(tag);
  }

  console.log(`🏷️ Created ${createdTags.length} tags`);

  // Blog posts data
  const blogPostsData = [
    {
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
      category: 'Development',
      tags: ['React', 'TypeScript', 'Frontend', 'Web Development'],
      featured: true,
    },
    {
      title: 'The Future of Web Design: Trends to Watch in 2024',
      excerpt: 'Explore the latest design trends that are shaping the future of web experiences.',
      content: `# The Future of Web Design: Trends to Watch in 2024

The web design landscape is constantly evolving, with new trends emerging that reshape how we think about user experience and visual design. Let's explore the key trends that are defining modern web design.

## Minimalist Interfaces

Less is more continues to be a driving principle in modern web design. Clean, uncluttered interfaces help users focus on what matters most.

## Dark Mode Everywhere

Dark mode isn't just a trend anymore—it's become an expectation. Users appreciate having the choice between light and dark themes.

## Micro-Interactions

Small animations and interactive elements that provide feedback and enhance the user experience are becoming increasingly important.

## Sustainable Web Design

- **Performance Optimization**: Faster loading times reduce energy consumption
- **Efficient Code**: Clean, optimized code uses fewer server resources
- **Green Hosting**: Choosing eco-friendly hosting solutions

The future of web design is bright, with endless possibilities for creativity and innovation!`,
      author: 'Sarah Chen',
      category: 'Design',
      tags: ['Web Design', 'Trends', 'UI/UX'],
      featured: false,
    },
    {
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
      category: 'Development',
      tags: ['CSS', 'Grid', 'Layout', 'Frontend'],
      featured: false,
    },
  ];

  // Create blog posts
  const createdBlogPosts = [];
  for (const postData of blogPostsData) {
    const slug = generateSlug(postData.title);
    const readTime = calculateReadTime(postData.content);

    const post = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        readTime,
        category: postData.category,
        featured: postData.featured,
        published: true,
        userId: adminUser.id,
      },
    });

    // Add tags to blog post
    for (const tagName of postData.tags) {
      const tag = createdTags.find(t => t.name === tagName);
      if (tag) {
        await prisma.tagOnBlogPost.create({
          data: {
            blogPostId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    createdBlogPosts.push(post);
  }

  console.log(`📝 Created ${createdBlogPosts.length} blog posts`);

  // Project data
  const projectsData = [
    {
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
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe API
- **Deployment**: Vercel

## Results

The platform successfully handles high traffic loads and provides a seamless shopping experience across all devices.`,
      category: 'Web App',
      technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      status: 'completed',
      demoUrl: 'https://ecommerce-demo.example.com',
      githubUrl: 'https://github.com/username/ecommerce-platform',
      featured: true,
    },
    {
      title: 'Real-time Chat Application',
      description: 'A modern chat application with real-time messaging, file sharing, and group conversations.',
      content: `# Real-time Chat Application

A feature-rich chat application built with modern web technologies, supporting real-time messaging, file sharing, and group conversations.

## Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **Group Chats**: Create and manage group conversations
- **File Sharing**: Upload and share images and documents
- **User Presence**: See when users are online/offline
- **Message History**: Persistent chat history
- **Responsive Design**: Works seamlessly on all devices

## Technology Stack

- **Frontend**: React, TypeScript, Socket.io Client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **File Storage**: AWS S3
- **Authentication**: JWT tokens
- **Deployment**: Docker containers on AWS

## Challenges Solved

- **Scalability**: Implemented Redis for session management
- **Real-time Updates**: Optimized WebSocket connections
- **File Handling**: Efficient file upload and processing

The application successfully supports hundreds of concurrent users with minimal latency.`,
      category: 'Web App',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'AWS', 'Docker'],
      status: 'completed',
      demoUrl: 'https://chat-demo.example.com',
      githubUrl: 'https://github.com/username/chat-app',
      featured: false,
    },
    {
      title: 'Collaborative Whiteboard',
      description: 'A real-time collaborative whiteboard application for teams and educators.',
      content: `# Collaborative Whiteboard

A real-time collaborative whiteboard application that allows multiple users to draw, annotate, and collaborate simultaneously. Perfect for remote teams, online education, and brainstorming sessions.

## Features

- **Real-time Collaboration**: Multiple users can draw simultaneously
- **Drawing Tools**: Pen, shapes, text, and sticky notes
- **Layers**: Organize content with multiple layers
- **Export Options**: Save as PNG, PDF, or SVG
- **Room Management**: Create private or public rooms
- **Voice Chat**: Integrated voice communication

## Technical Implementation

- **Frontend**: React with Canvas API for drawing
- **Real-time Sync**: WebSockets with conflict resolution
- **State Management**: Zustand with CRDT implementation
- **Backend**: Node.js with Express
- **Database**: Redis for real-time state, PostgreSQL for persistence
- **Deployment**: Docker containers with Kubernetes orchestration

## Results

The application successfully handles 500+ concurrent users per room with sub-100ms latency for drawing operations.`,
      category: 'Web App',
      technologies: ['React', 'Socket.io', 'Canvas API', 'Node.js', 'Redis', 'PostgreSQL', 'Docker'],
      status: 'completed',
      demoUrl: 'https://whiteboard-demo.example.com',
      githubUrl: 'https://github.com/username/collaborative-whiteboard',
      featured: false,
    },
  ];

  // Create projects
  const createdProjects = [];
  for (const projectData of projectsData) {
    const slug = generateSlug(projectData.title);

    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        slug,
        description: projectData.description,
        content: projectData.content,
        category: projectData.category,
        status: projectData.status.toUpperCase().replace('-', '_') as any,
        demoUrl: projectData.demoUrl,
        githubUrl: projectData.githubUrl,
        featured: projectData.featured,
        published: true,
        userId: adminUser.id,
      },
    });

    // Add technologies to project
    for (const techName of projectData.technologies) {
      const tag = createdTags.find(t => t.name === techName);
      if (tag) {
        await prisma.tagOnProject.create({
          data: {
            projectId: project.id,
            tagId: tag.id,
          },
        });
      }
    }

    createdProjects.push(project);
  }

  console.log(`💼 Created ${createdProjects.length} projects`);

  console.log('✅ Database seed completed successfully!');
  console.log(`
🎉 Seed Summary:
   👤 Admin user: admin@example.com (password: admin123)
   🏷️ Tags: ${createdTags.length}
   📝 Blog posts: ${createdBlogPosts.length}
   💼 Projects: ${createdProjects.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
