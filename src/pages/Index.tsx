
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Code2, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentCard } from '@/components/ContentCard';
import { FilterTabs } from '@/components/FilterTabs';
import { useItems, transformBlogPost, transformProject } from '@/hooks/useApi';
import { FilterOption, BlogPost, Project } from '@/types';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useItems({
    search: searchQuery || undefined,
    type: activeFilter !== 'all' ? activeFilter as 'blog' | 'project' : undefined,
  });

  // Transform and memoize content
  const allContent = useMemo(() => {
    if (!apiData) return [];
    
    return apiData.map((item: any) => {
      if (item.type === 'blog') {
        return { ...transformBlogPost(item), type: 'blog' as const };
      } else {
        return { ...transformProject(item), type: 'project' as const };
      }
    });
  }, [apiData]);

  const filteredContent = useMemo(() => {
    let filtered = allContent;

    // Apply search filter (additional client-side filtering if needed)
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ('excerpt' in item ? item.excerpt : item.description).toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.type === 'blog' ? item.tags : item.technologies).some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }
    return filtered;
  }, [allContent, searchQuery, activeFilter]);

  const featuredContent = useMemo(() => 
    allContent.filter(item => 'featured' in item && item.featured).slice(0, 2), 
    [allContent]
  );
  
  const counts = useMemo(() => ({
    all: allContent.length,
    blog: allContent.filter(item => item.type === 'blog').length,
    project: allContent.filter(item => item.type === 'project').length
  }), [allContent]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading content...</p>
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
          <p className="text-red-500 mb-4">Failed to load content. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Building the Future with{' '}
            <span className="text-gradient">Modern Web Tech</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore my journey in web development through detailed project showcases, 
            technical insights, and lessons learned from building modern applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/projects">
              <Button size="lg" className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all group">
                <span>View Projects</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="border-border hover:bg-surface-elevated">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Blog
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Content */}
        {featuredContent.length > 0 && <section className="mb-16 animate-slide-up">
            <div className="flex items-center space-x-2 mb-8">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Content</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredContent.map(content => (
                <ContentCard 
                  key={content.id} 
                  content={content as (BlogPost | Project) & { type: 'blog' | 'project' }} 
                  featured 
                />
              ))}
            </div>
          </section>}

        {/* Filter and Content Section */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Content</h2>
            <div className="text-sm text-muted-foreground">
              {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'}
            </div>
          </div>
          
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
          
          {/* Content Grid */}
          {filteredContent.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContent.map(content => (
                <ContentCard 
                  key={content.id} 
                  content={content as (BlogPost | Project) & { type: 'blog' | 'project' }} 
                />
              ))}
            </div> : <div className="text-center py-12">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No content found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No results found for "${searchQuery}"` : 'No content matches your current filter'}
              </p>
            </div>}
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;
