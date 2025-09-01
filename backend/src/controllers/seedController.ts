import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';
import { generateSlug, calculateReadTime } from '../utils/helpers';

const prisma = new PrismaClient();

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    console.log('🌱 Manual database seeding started...');
    
    // Check if already seeded
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return res.json({
        success: true,
        message: 'Database already seeded',
        data: { users: userCount }
      });
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created');

    // Create sample blog posts
    const blogPost1 = await prisma.blogPost.create({
      data: {
        title: 'Welcome to My Portfolio Blog',
        slug: generateSlug('Welcome to My Portfolio Blog'),
        excerpt: 'This is the first post on my portfolio blog. Here I will share my thoughts, projects, and learnings.',
        content: `# Welcome to My Portfolio Blog

This is my first blog post! I'm excited to share my journey as a developer and showcase my projects.

## What You'll Find Here

- Technical tutorials and guides
- Project showcases and case studies
- Thoughts on web development trends
- Career and learning experiences

Stay tuned for more content!`,
        author: 'Admin',
        readTime: '2 min read',
        category: 'General',
        featured: true,
        published: true,
        userId: adminUser.id,
      },
    });

    // Create sample project
    const project1 = await prisma.project.create({
      data: {
        title: 'Portfolio Website',
        slug: generateSlug('Portfolio Website'),
        description: 'A modern, responsive portfolio website built with React and TypeScript',
        content: `This portfolio website showcases my skills and projects using modern web technologies.

## Features
- Responsive design
- Dark/light theme
- Blog management
- Project showcase
- Admin panel

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Node.js
- Express
- Prisma
- SQLite`,
        status: 'COMPLETED',
        category: 'Web Development',
        featured: true,
        published: true,
        demoUrl: 'https://blog-management-ashen.vercel.app',
        githubUrl: 'https://github.com/Aryaman129/Blog-management',
        userId: adminUser.id,
      },
    });

    console.log('✅ Sample content created');

    const stats = {
      users: 1,
      blogPosts: 1,
      projects: 1
    };

    console.log('🎉 Database seeded successfully!', stats);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: stats
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: (error as Error).message
    });
  }
};
