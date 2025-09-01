
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

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

// Fallback data when backend is not available
const fallbackBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to set up a modern React application with TypeScript, covering best practices and common patterns.',
    content: `# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building modern web applications. In this comprehensive guide, we'll walk through setting up a new project and explore the key concepts you need to know.

## Why TypeScript with React?

TypeScript adds static type checking to JavaScript, which helps catch errors early in development and provides better IDE support with autocomplete and refactoring tools.

### Benefits:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and navigation
- **Improved Refactoring**: Safe and reliable code changes
- **Self-Documenting Code**: Types serve as inline documentation

## Setting Up Your Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Key Concepts

### Component Props
Always define interfaces for your component props:

\`\`\`typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {text}
    </button>
  );
};
\`\`\`

### State Management
Use typed state with useState:

\`\`\`typescript
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);
\`\`\`

## Best Practices

1. **Use strict TypeScript configuration**
2. **Create reusable type definitions**
3. **Leverage union types for better APIs**
4. **Use generics for flexible components**

This foundation will serve you well as you build more complex applications with React and TypeScript.`,
    author: 'Sarah Chen',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Frontend Development',
    tags: ['React', 'TypeScript', 'Web Development'],
    image: '/api/placeholder/800/400',
    featured: true,
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Node.js',
    slug: 'building-scalable-apis-nodejs',
    excerpt: 'Discover best practices for creating robust and scalable REST APIs using Node.js, Express, and modern architectural patterns.',
    content: `# Building Scalable APIs with Node.js

Creating scalable APIs is crucial for modern web applications. This guide covers essential patterns and practices for building robust backend services.

## Architecture Principles

### 1. Layered Architecture
Organize your code into clear layers:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Data access
- **Models**: Data structures

### 2. Error Handling
Implement comprehensive error handling:

\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
\`\`\`

## Database Integration

### Using Prisma ORM
Prisma provides excellent TypeScript support:

\`\`\`javascript
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World!' }
      ]
    }
  },
  include: {
    posts: true
  }
});
\`\`\`

## Performance Optimization

1. **Caching**: Implement Redis for frequently accessed data
2. **Connection Pooling**: Optimize database connections
3. **Rate Limiting**: Protect against abuse
4. **Compression**: Use gzip compression
5. **Pagination**: Implement cursor-based pagination

## Security Best Practices

- Input validation and sanitization
- Authentication and authorization
- CORS configuration
- Helmet.js for security headers
- Environment variable management

Following these patterns will help you build APIs that can scale with your application's growth.`,
    author: 'Mike Johnson',
    date: '2024-01-10',
    readTime: '12 min read',
    category: 'Backend Development',
    tags: ['Node.js', 'API', 'Backend', 'Express'],
    image: '/api/placeholder/800/400',
    featured: false,
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  }
];

const fallbackProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL, featuring real-time inventory management and payment processing.',
    content: `# E-Commerce Platform

A comprehensive e-commerce solution designed for modern online businesses.

## 🚀 Features

### Customer Experience
- **Responsive Design**: Optimized for all devices
- **Product Search & Filtering**: Advanced search capabilities
- **Shopping Cart**: Persistent cart across sessions
- **Secure Checkout**: Multiple payment options
- **Order Tracking**: Real-time order status updates

### Admin Dashboard
- **Inventory Management**: Real-time stock tracking
- **Order Management**: Process and fulfill orders
- **Analytics**: Sales reports and customer insights
- **Product Management**: Easy product CRUD operations

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Query**: Data fetching and caching
- **React Router**: Client-side routing

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **JWT**: Authentication

### Infrastructure
- **Docker**: Containerization
- **AWS S3**: Image storage
- **Stripe**: Payment processing
- **SendGrid**: Email notifications

## 📊 Performance Metrics

- **Page Load Time**: < 2 seconds
- **Lighthouse Score**: 95+
- **Uptime**: 99.9%
- **Mobile Optimization**: 100%

## 🔐 Security Features

- HTTPS encryption
- Input validation and sanitization
- Rate limiting
- CORS protection
- Secure authentication flow

## 📈 Results

Since launch, the platform has processed over $100K in transactions with a 99.9% uptime and excellent user feedback.`,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    date: '2024-01-20',
    status: 'completed',
    category: 'Full Stack',
    image: '/api/placeholder/800/600',
    demoUrl: 'https://demo-ecommerce.example.com',
    githubUrl: 'https://github.com/example/ecommerce-platform',
    featured: true,
    published: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'AI-Powered Chat Application',
    slug: 'ai-chat-application',
    description: 'Real-time chat application with AI integration, featuring smart responses, sentiment analysis, and multi-language support.',
    content: `# AI-Powered Chat Application

A next-generation chat application that leverages artificial intelligence to enhance communication.

## ✨ Key Features

### AI Integration
- **Smart Responses**: Context-aware AI suggestions
- **Sentiment Analysis**: Real-time emotion detection
- **Language Translation**: Multi-language support
- **Content Moderation**: Automatic inappropriate content filtering

### Real-time Communication
- **WebSocket Connection**: Instant message delivery
- **Typing Indicators**: Live typing status
- **Read Receipts**: Message delivery confirmation
- **File Sharing**: Support for images, documents, and media

### User Experience
- **Dark/Light Mode**: Customizable themes
- **Emoji Reactions**: Express emotions quickly
- **Message Search**: Find conversations easily
- **Notification System**: Stay updated on new messages

## 🧠 AI Capabilities

### Natural Language Processing
The application uses advanced NLP models to:
- Understand conversation context
- Generate relevant response suggestions
- Detect and analyze sentiment
- Provide real-time language translation

### Machine Learning Models
- **GPT-4**: Conversation assistance
- **BERT**: Sentiment analysis
- **Google Translate API**: Multi-language support
- **Custom Moderation Model**: Content filtering

## 🔧 Technical Implementation

### Frontend Architecture
\`\`\`typescript
// WebSocket connection management
const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => ws.close();
  }, [url]);

  return { socket, isConnected };
};
\`\`\`

### Backend Services
- **Message Queue**: Redis for message processing
- **Database**: MongoDB for chat history
- **AI Service**: Integration with OpenAI API
- **Authentication**: JWT-based auth system

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly across:
- Desktop browsers
- Mobile devices
- Tablet interfaces
- Progressive Web App (PWA) support

## 🚀 Performance Optimizations

- Message virtualization for large conversations
- Lazy loading of chat history
- Optimistic UI updates
- Efficient WebSocket connection management
- Image compression and CDN integration

This project demonstrates the potential of combining real-time communication with artificial intelligence to create more engaging and intelligent chat experiences.`,
    technologies: ['React', 'WebSocket', 'OpenAI API', 'MongoDB', 'Redis'],
    date: '2024-01-12',
    status: 'in-progress',
    category: 'AI/ML',
    image: '/api/placeholder/800/600',
    demoUrl: 'https://demo-chat.example.com',
    githubUrl: 'https://github.com/example/ai-chat-app',
    featured: true,
    published: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  }
];

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
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get the error message from the response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
        } catch (jsonError) {
          // If JSON parsing fails, use the status message
          errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all items (blog posts and projects) with fallback
  async getItems(params?: {
    type?: 'blog' | 'project';
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<any[]>> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.type) searchParams.append('type', params.type);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('q', params.search);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());

      const query = searchParams.toString();
      const endpoint = `/items${query ? `?${query}` : ''}`;
      
      return await this.request<any[]>(endpoint);
    } catch (error) {
      console.warn('API not available, using fallback data');
      // Return fallback data when API is not available
      let fallbackData: any[] = [];
      
      if (!params?.type || params.type === 'blog') {
        fallbackData = [...fallbackData, ...fallbackBlogPosts];
      }
      
      if (!params?.type || params.type === 'project') {
        fallbackData = [...fallbackData, ...fallbackProjects];
      }

      // Apply search filter if provided
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        fallbackData = fallbackData.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm)) ||
          (item.description && item.description.toLowerCase().includes(searchTerm))
        );
      }

      // Apply type filter
      if (params?.type) {
        fallbackData = fallbackData.filter(item => {
          if (params.type === 'blog') {
            return item.excerpt; // Blog posts have excerpt
          } else if (params.type === 'project') {
            return item.description; // Projects have description
          }
          return true;
        });
      }

      return {
        success: true,
        message: 'Items retrieved successfully',
        data: fallbackData
      };
    }
  }

  // Get single item by slug with fallback
  async getItemById(slug: string): Promise<ApiResponse<any>> {
    try {
      return await this.request<any>(`/items/${slug}`);
    } catch (error) {
      console.warn('API not available, using fallback data');
      console.log('Searching for item with ID/slug:', slug);
      
      // Try to find in fallback data
      const allFallbackData = [...fallbackBlogPosts, ...fallbackProjects];
      
      // Try multiple matching strategies
      const item = allFallbackData.find(item => 
        item.id === slug || 
        item.slug === slug ||
        String(item.id) === slug ||
        (item.slug && item.slug.toLowerCase() === slug.toLowerCase()) ||
        item.id === slug.toString() ||
        (typeof slug === 'string' && item.id === parseInt(slug).toString())
      );
      
      console.log('Found fallback item:', item);
      
      if (item) {
        return {
          success: true,
          message: 'Item retrieved successfully',
          data: item
        };
      } else {
        throw new Error('Item not found');
      }
    }
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
    console.log('API Client - Creating blog post:', blogPost);
    console.log('API Client - Using token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
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
