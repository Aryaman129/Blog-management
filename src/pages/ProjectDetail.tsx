import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Github, Tag, Share2, CheckCircle, Clock, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useItem, transformProject } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetail() {
  const { slug } = useParams();
  
  // Don't make API call if slug is undefined
  const { data: apiData, isLoading, error } = useItem(slug);

  // Transform the data if it exists
  const project = apiData ? transformProject(apiData) : null;

  // Handle missing slug
  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="text-muted-foreground">The requested project could not be found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading project...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error or not found
  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/">
            <Button className="hover:scale-105 transition-transform duration-300">Go Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const statusIcons = {
    completed: CheckCircle,
    'in-progress': Clock,
    planned: Zap,
  };

  const statusColors = {
    completed: "text-green-400 bg-green-500/20 border-green-500/30",
    'in-progress': "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    planned: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  };

  // Ensure status exists and is valid, provide fallback
  const projectStatus = project.status || 'planned';
  const StatusIcon = statusIcons[projectStatus];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          to="/projects" 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group hover:scale-105 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to all projects</span>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 animate-fade-in">
            <div className="flex flex-wrap items-center gap-4 mb-4 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              {project.featured && (
                <Badge className="gradient-primary text-white border-0 animate-pulse">
                  Featured Project
                </Badge>
              )}
              
              <Badge 
                variant="secondary" 
                className={cn("flex items-center space-x-1 hover:scale-110 transition-transform duration-300", statusColors[projectStatus])}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{projectStatus.replace('-', ' ')}</span>
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {project.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              {project.description}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                <Calendar className="h-4 w-4" />
                <span>{project.date}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                <Tag className="h-4 w-4" />
                <span>{project.category}</span>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-surface-elevated hover:scale-105 transition-all duration-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Technologies */}
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <h3 className="text-sm font-semibold text-foreground mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge 
                    key={tech} 
                    variant="secondary" 
                    className="bg-surface hover:bg-surface-elevated transition-all duration-300 hover:scale-110"
                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              {project.demoUrl && (
                <Button className="gradient-primary text-white hover:scale-105 transition-transform duration-300" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" className="hover:scale-105 transition-transform duration-300" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-12 flex items-center justify-center animate-scale-in hover:scale-105 transition-transform duration-500" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="text-6xl opacity-20 animate-pulse">💻</div>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
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
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed hover:text-foreground transition-colors duration-300">{children}</li>
                ),
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>

          {/* Project Actions */}
          <div className="mt-16 pt-8 border-t border-border/40 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Interested in this project?</h3>
                <p className="text-muted-foreground">
                  Check out the live demo or explore the source code.
                </p>
              </div>
              <div className="flex gap-4">
                {project.demoUrl && (
                  <Button className="gradient-primary text-white hover:scale-105 transition-transform duration-300" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" className="hover:scale-105 transition-transform duration-300" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Related Projects CTA */}
          <div className="mt-12 pt-8 border-t border-border/40 text-center animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
            <h3 className="text-xl font-semibold mb-4">Want to see more?</h3>
            <p className="text-muted-foreground mb-6">
              Explore more projects and articles on TechHub.
            </p>
            <Link to="/">
              <Button className="gradient-primary text-white hover:scale-105 transition-transform duration-300">
                View All Content
              </Button>
            </Link>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
