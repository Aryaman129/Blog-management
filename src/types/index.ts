
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: string;
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export type ContentType = 'blog' | 'project';
export type FilterOption = 'all' | 'blog' | 'project' | string;
