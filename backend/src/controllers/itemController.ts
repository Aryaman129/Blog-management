import { Request, Response } from 'express';
import prisma from '../utils/database';
import { createSuccessResponse, createErrorResponse, generateSlug, parseNumber, parseBoolean } from '../utils/helpers';
import { ItemQuery, CreateBlogPostRequest, UpdateBlogPostRequest, CreateProjectRequest, UpdateProjectRequest } from '../types';

export const getItems = async (req: Request, res: Response) => {
  try {
    const {
      q,
      type,
      tag,
      category,
      status,
      featured,
      published = 'true',
      page = '1',
      limit = '10',
      offset
    }: ItemQuery = req.query;

    const pageNum = parseNumber(page, 1)!;
    const limitNum = parseNumber(limit, 10)!;
    const offsetNum = parseNumber(offset) || (pageNum - 1) * limitNum;

    const featuredBool = parseBoolean(featured);
    const publishedBool = parseBoolean(published) ?? true;

    let items: any[] = [];
    let total = 0;

    if (!type || type === 'blog') {
      // Get blog posts
      const blogWhere: any = {
        published: publishedBool,
        ...(featuredBool !== undefined && { featured: featuredBool }),
        ...(category && { category: { contains: category, mode: 'insensitive' } }),
        ...(q && {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } },
          ],
        }),
        ...(tag && {
          tags: {
            some: {
              tag: {
                name: { contains: tag, mode: 'insensitive' },
              },
            },
          },
        }),
      };

      const blogPosts = await prisma.blogPost.findMany({
        where: blogWhere,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: type === 'blog' ? offsetNum : 0,
        take: type === 'blog' ? limitNum : undefined,
      });

      const blogItems = blogPosts.map(post => ({
        id: post.id,
        type: 'blog',
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.createdAt.toISOString().split('T')[0],
        readTime: post.readTime,
        category: post.category,
        tags: post.tags.map(t => t.tag.name),
        image: post.images.find(img => img.type === 'COVER')?.url || '/api/placeholder/800/400',
        featured: post.featured,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));

      if (type === 'blog') {
        items = blogItems;
        total = await prisma.blogPost.count({ where: blogWhere });
      } else {
        items.push(...blogItems);
      }
    }

    if (!type || type === 'project') {
      // Get projects
      const projectWhere: any = {
        published: publishedBool,
        ...(featuredBool !== undefined && { featured: featuredBool }),
        ...(category && { category: { contains: category, mode: 'insensitive' } }),
        ...(status && { status: status.toUpperCase().replace('-', '_') }),
        ...(q && {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        }),
        ...(tag && {
          technologies: {
            some: {
              tag: {
                name: { contains: tag, mode: 'insensitive' },
              },
            },
          },
        }),
      };

      const projects = await prisma.project.findMany({
        where: projectWhere,
        include: {
          technologies: {
            include: {
              tag: true,
            },
          },
          images: true,
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: type === 'project' ? offsetNum : 0,
        take: type === 'project' ? limitNum : undefined,
      });

      const projectItems = projects.map(project => ({
        id: project.id,
        type: 'project',
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        date: project.createdAt.toISOString().split('T')[0],
        status: project.status.toLowerCase().replace('_', '-'),
        category: project.category,
        technologies: project.technologies.map(t => t.tag.name),
        image: project.images.find(img => img.type === 'COVER')?.url || '/api/placeholder/800/600',
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        published: project.published,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));

      if (type === 'project') {
        items = projectItems;
        total = await prisma.project.count({ where: projectWhere });
      } else {
        items.push(...projectItems);
      }
    }

    // If no specific type, sort all items by date and paginate
    if (!type) {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      total = items.length;
      items = items.slice(offsetNum, offsetNum + limitNum);
    }

    const hasMore = offsetNum + limitNum < total;

    res.json(createSuccessResponse('Items retrieved successfully', items, {
      total,
      page: pageNum,
      limit: limitNum,
      hasMore,
    }));
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve items'));
  }
};

export const getItemBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Try to find as blog post first
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (blogPost) {
      const item = {
        id: blogPost.id,
        type: 'blog',
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        author: blogPost.author,
        date: blogPost.createdAt.toISOString().split('T')[0],
        readTime: blogPost.readTime,
        category: blogPost.category,
        tags: blogPost.tags.map(t => t.tag.name),
        image: blogPost.images.find(img => img.type === 'COVER')?.url || '/api/placeholder/800/400',
        featured: blogPost.featured,
        published: blogPost.published,
        createdAt: blogPost.createdAt,
        updatedAt: blogPost.updatedAt,
      };

      return res.json(createSuccessResponse('Blog post retrieved successfully', item));
    }

    // Try to find as project
    const project = await prisma.project.findUnique({
      where: { slug, published: true },
      include: {
        technologies: {
          include: {
            tag: true,
          },
        },
        images: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (project) {
      const item = {
        id: project.id,
        type: 'project',
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        date: project.createdAt.toISOString().split('T')[0],
        status: project.status.toLowerCase().replace('_', '-'),
        category: project.category,
        technologies: project.technologies.map(t => t.tag.name),
        image: project.images.find(img => img.type === 'COVER')?.url || '/api/placeholder/800/600',
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        published: project.published,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };

      return res.json(createSuccessResponse('Project retrieved successfully', item));
    }

    res.status(404).json(createErrorResponse('Item not found'));
  } catch (error) {
    console.error('Get item by slug error:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve item'));
  }
};
