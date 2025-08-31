import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { BlogPost, Project } from '@/types';

// Hook to fetch all items (blog posts and projects)
export const useItems = (params?: {
  type?: 'blog' | 'project';
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: async () => {
      const response = await apiClient.getItems(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch blog posts only
export const useBlogPosts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  return useItems({ ...params, type: 'blog' });
};

// Hook to fetch projects only
export const useProjects = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  return useItems({ ...params, type: 'project' });
};

// Hook to fetch a single item by ID
export const useItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const response = await apiClient.getItemById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch featured content
export const useFeaturedContent = () => {
  return useItems({ featured: true, limit: 10 });
};

// Transform backend data to frontend types
export const transformBlogPost = (item: any): BlogPost => ({
  id: item.id,
  title: item.title,
  excerpt: item.excerpt || item.description,
  content: item.content,
  author: item.author?.username || item.author || 'Unknown',
  date: new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }),
  readTime: item.readTime || '5 min read',
  category: item.category,
  tags: item.tags?.map((tag: any) => tag.name || tag) || [],
  image: item.image?.url || item.image || '/api/placeholder/400/250',
  featured: item.featured || false,
});

export const transformProject = (item: any): Project => ({
  id: item.id,
  title: item.title,
  description: item.description,
  content: item.content,
  technologies: item.tags?.map((tag: any) => tag.name || tag) || [],
  date: new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }),
  status: item.status as 'completed' | 'in-progress' | 'planned',
  category: item.category,
  image: item.image?.url || item.image || '/api/placeholder/400/250',
  demoUrl: item.demoUrl,
  githubUrl: item.githubUrl,
  featured: item.featured || false,
});
