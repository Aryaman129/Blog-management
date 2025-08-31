import { Request, Response } from 'express';
import prisma from '../utils/database';
import { createSuccessResponse, createErrorResponse, generateSlug } from '../utils/helpers';
import { CreateProjectRequest, UpdateProjectRequest } from '../types';

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    const {
      title,
      description,
      content,
      category,
      technologies,
      status = 'planned',
      demoUrl,
      githubUrl,
      featured = false,
      published = true,
    }: CreateProjectRequest = req.body;

    // Generate slug from title
    let slug = generateSlug(title);
    
    // Check if slug exists and make it unique
    const existingProject = await prisma.project.findUnique({ where: { slug } });
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }

    // Convert status to uppercase format
    const projectStatus = status.toUpperCase().replace('-', '_');

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        category,
        status: projectStatus,
        demoUrl,
        githubUrl,
        featured,
        published,
        userId,
      },
    });

    // Handle technologies
    if (technologies && technologies.length > 0) {
      for (const techName of technologies) {
        // Create tag if it doesn't exist
        const tag = await prisma.tag.upsert({
          where: { name: techName },
          update: {},
          create: {
            name: techName,
            slug: generateSlug(techName),
          },
        });

        // Create association
        await prisma.tagOnProject.create({
          data: {
            projectId: project.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch the complete project with relations
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        technologies: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });

    res.status(201).json(createSuccessResponse('Project created successfully', {
      id: completeProject!.id,
      title: completeProject!.title,
      slug: completeProject!.slug,
      description: completeProject!.description,
      content: completeProject!.content,
      category: completeProject!.category,
      status: completeProject!.status.toLowerCase().replace('_', '-'),
      technologies: completeProject!.technologies.map(t => t.tag.name),
      demoUrl: completeProject!.demoUrl,
      githubUrl: completeProject!.githubUrl,
      featured: completeProject!.featured,
      published: completeProject!.published,
      createdAt: completeProject!.createdAt,
      updatedAt: completeProject!.updatedAt,
    }));
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json(createErrorResponse('Failed to create project'));
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    const updateData: UpdateProjectRequest = req.body;

    // Check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { technologies: true },
    });

    if (!existingProject) {
      return res.status(404).json(createErrorResponse('Project not found'));
    }

    if (existingProject.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only update your own projects'));
    }

    // Handle slug update if title changed
    let newSlug = existingProject.slug;
    if (updateData.title && updateData.title !== existingProject.title) {
      newSlug = generateSlug(updateData.title);
      
      // Check if new slug exists
      const slugExists = await prisma.project.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });
      
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Convert status to uppercase format if provided
    let projectStatus = existingProject.status;
    if (updateData.status) {
      projectStatus = updateData.status.toUpperCase().replace('-', '_');
    }

    // Update project
    const { technologies: _, ...projectUpdateData } = updateData;
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...projectUpdateData,
        slug: newSlug,
        status: projectStatus,
      },
    });

    // Handle technologies update
    if (updateData.technologies) {
      // Remove existing technology associations
      await prisma.tagOnProject.deleteMany({
        where: { projectId: id },
      });

      // Add new technology associations
      for (const techName of updateData.technologies) {
        const tag = await prisma.tag.upsert({
          where: { name: techName },
          update: {},
          create: {
            name: techName,
            slug: generateSlug(techName),
          },
        });

        await prisma.tagOnProject.create({
          data: {
            projectId: id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch updated project with relations
    const completeProject = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });

    res.json(createSuccessResponse('Project updated successfully', {
      id: completeProject!.id,
      title: completeProject!.title,
      slug: completeProject!.slug,
      description: completeProject!.description,
      content: completeProject!.content,
      category: completeProject!.category,
      status: completeProject!.status.toLowerCase().replace('_', '-'),
      technologies: completeProject!.technologies.map(t => t.tag.name),
      demoUrl: completeProject!.demoUrl,
      githubUrl: completeProject!.githubUrl,
      featured: completeProject!.featured,
      published: completeProject!.published,
      createdAt: completeProject!.createdAt,
      updatedAt: completeProject!.updatedAt,
    }));
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json(createErrorResponse('Failed to update project'));
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }

    // Check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json(createErrorResponse('Project not found'));
    }

    if (existingProject.userId !== userId) {
      return res.status(403).json(createErrorResponse('You can only delete your own projects'));
    }

    // Delete project (cascading deletes will handle technologies and images)
    await prisma.project.delete({
      where: { id },
    });

    res.json(createSuccessResponse('Project deleted successfully'));
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json(createErrorResponse('Failed to delete project'));
  }
};
