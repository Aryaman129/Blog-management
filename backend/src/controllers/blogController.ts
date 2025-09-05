import { Request, Response } from 'express';
import prisma from '../utils/database';
import { createSuccessResponse, createErrorResponse, generateSlug, calculateReadTime } from '../utils/helpers';
import { CreateBlogPostRequest, UpdateBlogPostRequest } from '../types';

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    console.log('=== CREATE BLOG POST DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request user:', req.user);
    console.log('Request headers:', req.headers);
    
    const userId = req.user?.userId;
    if (!userId) {
      console.log('ERROR: User not authenticated');
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    // Test database connection
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log('Database test successful, user count:', userCount);

    const {
      title,
      excerpt,
      content,
      author,
      readTime,
      category,
      tags,
      featured = false,
      published = true,
    }: CreateBlogPostRequest = req.body;

    console.log('Extracted fields:', { title, excerpt, content, author, readTime, category, tags, featured, published });

    // Validate required fields
    if (!title || !excerpt || !content || !author || !category) {
      console.log('ERROR: Missing required fields');
      return res.status(400).json(createErrorResponse('Missing required fields: title, excerpt, content, author, category'));
    }

    console.log('Starting blog post creation...');

    // Generate slug from title
    let slug = generateSlug(title);
    console.log('Generated slug:', slug);
    
    // Check if slug exists and make it unique
    console.log('Checking for existing slug...');
    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
      console.log('Slug exists, using unique slug:', slug);
    }

    // Calculate read time if not provided
    const finalReadTime = readTime || calculateReadTime(content);
    console.log('Final read time:', finalReadTime);

    // Create blog post
    console.log('Creating blog post with data:', {
      title, slug, excerpt, content, author, readTime: finalReadTime, category, featured, published, userId
    });
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        readTime: finalReadTime,
        category,
        featured,
        published,
        userId,
      },
    });
    
    console.log('Blog post created successfully, ID:', blogPost.id);

    // Handle tags
    if (tags && tags.length > 0) {
      console.log('Processing tags:', tags);
      for (const tagName of tags) {
        console.log('Processing tag:', tagName);
        // Create tag if it doesn't exist
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: generateSlug(tagName),
          },
        });
        console.log('Tag processed:', tag.id);

        // Create association
        await prisma.tagOnBlogPost.create({
          data: {
            blogPostId: blogPost.id,
            tagId: tag.id,
          },
        });
        console.log('Tag association created');
      }
    } else {
      console.log('No tags to process');
    }

    // Fetch the complete blog post with relations
    const completeBlogPost = await prisma.blogPost.findUnique({
      where: { id: blogPost.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });

    res.status(201).json(createSuccessResponse('Blog post created successfully', {
      id: completeBlogPost!.id,
      title: completeBlogPost!.title,
      slug: completeBlogPost!.slug,
      excerpt: completeBlogPost!.excerpt,
      content: completeBlogPost!.content,
      author: completeBlogPost!.author,
      readTime: completeBlogPost!.readTime,
      category: completeBlogPost!.category,
      tags: completeBlogPost!.tags.map(t => t.tag.name),
      featured: completeBlogPost!.featured,
      published: completeBlogPost!.published,
      createdAt: completeBlogPost!.createdAt,
      updatedAt: completeBlogPost!.updatedAt,
    }));
  } catch (error) {
    console.error('=== CREATE BLOG POST ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check if it's a Prisma validation error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code);
      console.error('Prisma error meta:', (error as any).meta);
    }
    
    res.status(500).json(createErrorResponse('Failed to create blog post'));
  }
};

export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    const updateData: UpdateBlogPostRequest = req.body;

    // Check if blog post exists and user owns it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingPost) {
      return res.status(404).json(createErrorResponse('Blog post not found'));
    }

    if (existingPost.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only update your own blog posts'));
    }

    // Handle slug update if title changed
    let newSlug = existingPost.slug;
    if (updateData.title && updateData.title !== existingPost.title) {
      newSlug = generateSlug(updateData.title);
      
      // Check if new slug exists
      const slugExists = await prisma.blogPost.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });
      
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Calculate read time if content changed
    let newReadTime = updateData.readTime;
    if (updateData.content && updateData.content !== existingPost.content) {
      newReadTime = newReadTime || calculateReadTime(updateData.content);
    }

    // Update blog post
    const { tags: _, ...blogUpdateData } = updateData;
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...blogUpdateData,
        slug: newSlug,
        readTime: newReadTime || existingPost.readTime,
      },
    });

    // Handle tags update
    if (updateData.tags) {
      // Remove existing tag associations
      await prisma.tagOnBlogPost.deleteMany({
        where: { blogPostId: id },
      });

      // Add new tag associations
      for (const tagName of updateData.tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: generateSlug(tagName),
          },
        });

        await prisma.tagOnBlogPost.create({
          data: {
            blogPostId: id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch updated blog post with relations
    const completeBlogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });

    res.json(createSuccessResponse('Blog post updated successfully', {
      id: completeBlogPost!.id,
      title: completeBlogPost!.title,
      slug: completeBlogPost!.slug,
      excerpt: completeBlogPost!.excerpt,
      content: completeBlogPost!.content,
      author: completeBlogPost!.author,
      readTime: completeBlogPost!.readTime,
      category: completeBlogPost!.category,
      tags: completeBlogPost!.tags.map(t => t.tag.name),
      featured: completeBlogPost!.featured,
      published: completeBlogPost!.published,
      createdAt: completeBlogPost!.createdAt,
      updatedAt: completeBlogPost!.updatedAt,
    }));
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json(createErrorResponse('Failed to update blog post'));
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    // Check if blog post exists and user owns it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json(createErrorResponse('Blog post not found'));
    }

    if (existingPost.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only delete your own blog posts'));
    }

    // Delete blog post (cascading deletes will handle tags and images)
    await prisma.blogPost.delete({
      where: { id },
    });

    res.json(createSuccessResponse('Blog post deleted successfully'));
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json(createErrorResponse('Failed to delete blog post'));
  }
};
