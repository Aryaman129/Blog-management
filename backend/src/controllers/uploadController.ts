import { Request, Response } from 'express';
import path from 'path';
import prisma from '../utils/database';
import { createSuccessResponse, createErrorResponse } from '../utils/helpers';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(createErrorResponse('No file uploaded'));
    }

    const file = req.file;
    const { alt, type = 'GENERAL', blogPostId, projectId } = req.body;

    // Create image record in database
    const image = await prisma.image.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.filename}`,
        alt: alt || file.originalname,
        type: type.toUpperCase(),
        blogPostId: blogPostId || null,
        projectId: projectId || null,
      },
    });

    res.status(201).json(createSuccessResponse('Image uploaded successfully', {
      id: image.id,
      filename: image.filename,
      originalName: image.originalName,
      url: image.url,
      alt: image.alt,
      type: image.type,
      size: image.size,
      mimeType: image.mimeType,
      createdAt: image.createdAt,
    }));
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json(createErrorResponse('Failed to upload image'));
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const { type, blogPostId, projectId } = req.query;

    const where: any = {};
    if (type) where.type = type.toString().toUpperCase();
    if (blogPostId) where.blogPostId = blogPostId.toString();
    if (projectId) where.projectId = projectId.toString();

    const images = await prisma.image.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const imageData = images.map(image => ({
      id: image.id,
      filename: image.filename,
      originalName: image.originalName,
      url: image.url,
      alt: image.alt,
      type: image.type,
      size: image.size,
      mimeType: image.mimeType,
      blogPostId: image.blogPostId,
      projectId: image.projectId,
      createdAt: image.createdAt,
    }));

    res.json(createSuccessResponse('Images retrieved successfully', imageData));
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve images'));
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        blogPost: true,
        project: true,
      },
    });

    if (!image) {
      return res.status(404).json(createErrorResponse('Image not found'));
    }

    // Check if user owns the associated content
    if (image.blogPost && image.blogPost.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only delete images from your own content'));
    }
    
    if (image.project && image.project.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only delete images from your own content'));
    }

    // Delete image from database
    await prisma.image.delete({
      where: { id },
    });

    // Note: In production, you'd also want to delete the physical file
    // const fs = require('fs');
    // fs.unlinkSync(image.path);

    res.json(createSuccessResponse('Image deleted successfully'));
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json(createErrorResponse('Failed to delete image'));
  }
};
