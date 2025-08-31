
import { useState, useMemo } from 'react';
import { Code2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { useProjects, transformProject } from '@/hooks/useApi';
import { Project } from '@/types';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects from API
  const { data: apiData, isLoading, error } = useProjects({
    search: searchQuery || undefined,
  });

  const filteredProjects = useMemo(() => {
    if (!apiData) return [];
    
    return apiData.map((project: any) => ({
      ...transformProject(project),
      type: 'project' as const
    }));
  }, [apiData]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
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
          <p className="text-red-500 mb-4">Failed to load projects. Please try again later.</p>
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
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Portfolio & Case Studies
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Projects</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore my portfolio of web applications, from e-commerce platforms to AI-powered tools.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Projects</h2>
            <div className="text-sm text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ContentCard 
                  key={project.id} 
                  content={project}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No projects found for "${searchQuery}"`
                  : 'No projects available'
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
