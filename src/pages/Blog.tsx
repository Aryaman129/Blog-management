
import { useState, useMemo } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { useBlogPosts, transformBlogPost } from '@/hooks/useApi';
import { BlogPost } from '@/types';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blog posts from API
  const { data: apiData, isLoading, error } = useBlogPosts({
    search: searchQuery || undefined,
  });

  const filteredPosts = useMemo(() => {
    if (!apiData) return [];
    
    return apiData.map((post: any) => transformBlogPost(post));
  }, [apiData]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500 mb-4">Failed to load blog posts. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-surface-elevated/50 border border-border/40 rounded-full px-4 py-2 mb-6">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Technical Insights & Tutorials
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Blog</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Dive deep into web development topics, tutorials, and lessons learned from building modern applications.
          </p>
        </section>

        {/* Blog Posts Grid */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Posts</h2>
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <ContentCard 
                  key={post.id} 
                  item={post}
                  type="blog"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No posts found for "${searchQuery}"`
                  : 'No blog posts available'
                }
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
