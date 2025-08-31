const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all items (blog posts and projects)
  async getItems(params?: {
    type?: 'blog' | 'project';
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());

    const query = searchParams.toString();
    const endpoint = `/items${query ? `?${query}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  // Get single item by ID
  async getItemById(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/items/${id}`);
  }

  // Authentication methods
  async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    // Convert username to email format for the backend
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.username, // Backend expects email field
        password: credentials.password
      }),
    });
  }

  async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Blog post methods
  async createBlogPost(blogPost: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/blog', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(blogPost),
    });
  }

  async updateBlogPost(id: string, blogPost: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(blogPost),
    });
  }

  async deleteBlogPost(id: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Project methods
  async createProject(project: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // File upload
  async uploadFile(file: File, token: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<any>('/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
