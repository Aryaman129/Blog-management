
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useItem, transformBlogPost } from '@/hooks/useApi';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: apiData, isLoading, error } = useItem(slug);

  // Transform the data if it exists
  const post = apiData ? transformBlogPost(apiData) : null;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error or not found
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/">
            <Button className="hover:scale-105 transition-transform duration-300">Go Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group hover:scale-105 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to all posts</span>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 animate-fade-in">
            {post.featured && (
              <Badge className="gradient-primary text-white border-0 mb-4 animate-pulse">
                Featured Post
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {post.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                <User className="h-4 w-4" />
                <span>by {post.author}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-surface-elevated hover:scale-105 transition-all duration-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              {post.tags.map((tag, index) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-surface hover:bg-surface-elevated transition-all duration-300 hover:scale-110"
                  style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-12 flex items-center justify-center animate-scale-in hover:scale-105 transition-transform duration-500" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="text-6xl opacity-20 animate-pulse">📝</div>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-foreground mb-6 mt-12 first:mt-0 hover:text-primary transition-colors duration-300">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-foreground mb-4 mt-10 hover:text-primary transition-colors duration-300">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mb-3 mt-8 hover:text-primary transition-colors duration-300">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-6 hover:text-foreground transition-colors duration-300">
                    {children}
                  </p>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre className="bg-surface border border-border/40 rounded-lg p-4 overflow-x-auto mb-6 hover:border-primary/40 transition-colors duration-300">
                        <code className="text-sm font-mono text-foreground">
                          {children}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <code className="bg-surface px-2 py-1 rounded text-sm font-mono text-primary border border-border/40 hover:bg-primary/10 transition-colors duration-300">
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary bg-surface/50 p-4 rounded-r-lg mb-6 italic hover:bg-surface/70 transition-colors duration-300">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed hover:text-foreground transition-colors duration-300">{children}</li>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Related Posts CTA */}
          <div className="mt-16 pt-8 border-t border-border/40 text-center animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <h3 className="text-xl font-semibold mb-4">Enjoyed this post?</h3>
            <p className="text-muted-foreground mb-6">
              Check out more articles and projects on TechHub.
            </p>
            <Link to="/">
              <Button className="gradient-primary text-white hover:scale-105 transition-transform duration-300">
                Explore More Content
              </Button>
            </Link>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
