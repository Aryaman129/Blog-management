
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost, Project } from '@/types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: (BlogPost | Project) & { type: 'blog' | 'project' };
  featured?: boolean;
}

export function ContentCard({ content, featured = false }: ContentCardProps) {
  const isBlog = content.type === 'blog';
  const project = content as Project;
  const blog = content as BlogPost;

  return (
    <Card className={cn(
      "group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/20 animate-fade-in hover:scale-[1.02]",
      featured && "ring-1 ring-primary/20 shadow-lg shadow-primary/5"
    )}>
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
          <div className="text-4xl opacity-20 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
            {isBlog ? '📝' : '💻'}
          </div>
        </div>
        
        {featured && (
          <Badge className="absolute top-3 left-3 gradient-primary text-white border-0 animate-pulse">
            Featured
          </Badge>
        )}
        
        {!isBlog && project.status && (
          <Badge 
            variant="secondary" 
            className={cn(
              "absolute top-3 right-3 transition-all duration-300 hover:scale-110",
              project.status === 'completed' && "bg-green-500/20 text-green-400 border-green-500/30",
              project.status === 'in-progress' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              project.status === 'planned' && "bg-blue-500/20 text-blue-400 border-blue-500/30"
            )}
          >
            {project.status.replace('-', ' ')}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <Calendar className="h-4 w-4" />
          <span>{content.date}</span>
          {isBlog && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          {content.title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {isBlog ? blog.excerpt : project.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags/Technologies */}
        <div className="flex flex-wrap gap-2 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {(isBlog ? blog.tags : project.technologies).slice(0, 3).map((item, index) => (
            <Badge 
              key={item} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <Tag className="h-3 w-3 mr-1" />
              {item}
            </Badge>
          ))}
          {(isBlog ? blog.tags : project.technologies).length > 3 && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:scale-110 transition-transform duration-300">
              +{(isBlog ? blog.tags : project.technologies).length - 3} more
            </Badge>
          )}
        </div>

        {/* Author (for blog) */}
        {isBlog && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <User className="h-4 w-4" />
            <span>by {blog.author}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <Link 
            to={`/${content.type}/${(content as any).slug || content.id}`}
            className="flex items-center space-x-2 text-primary hover:text-accent transition-all duration-300 group/link hover:scale-105"
          >
            <span className="font-medium">Read More</span>
            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
          </Link>
          
          {!isBlog && (
            <div className="flex space-x-2">
              {project.demoUrl && (
                <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform duration-300" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform duration-300" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
