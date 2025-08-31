export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  offset?: string;
}

export interface ItemQuery extends PaginationQuery {
  q?: string;
  type?: 'blog' | 'project';
  tag?: string;
  category?: string;
  status?: string;
  featured?: string;
  published?: string;
}

export interface CreateBlogPostRequest {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {}

export interface CreateProjectRequest {
  title: string;
  description: string;
  content: string;
  category: string;
  technologies: string[];
  status?: 'completed' | 'in-progress' | 'planned';
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  published?: boolean;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
