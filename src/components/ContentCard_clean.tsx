import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ExternalLink, Github, CheckCircle, Zap } from 'lucide-react';
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

  // Use slug if available, otherwise fallback to id
  const itemSlug = content.slug || (typeof content.id === 'string' ? content.id : String(content.id));
  const linkPath = isBlog ? `/blog/${itemSlug}` : `/project/${itemSlug}`;

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

  return (
    <Card className={cn(
      "group overflow-hidden border-0 bg-surface/50 backdrop-blur-sm hover:bg-surface/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in hover:scale-[1.02]",
      featured && "ring-2 ring-primary/20"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link 
              to={linkPath}
              className="block group-hover:no-underline"
            >
              <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {content.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
              {isBlog ? blog.excerpt : project.description}
            </p>
          </div>
          {content.featured && (
            <Badge className="gradient-primary text-white border-0 animate-pulse shrink-0">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
            <Calendar className="h-3 w-3" />
            <span>{content.date}</span>
          </div>
          
          {isBlog && blog.readTime && (
            <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
              <Clock className="h-3 w-3" />
              <span>{blog.readTime}</span>
            </div>
          )}

          {isBlog && blog.author && (
            <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
              <User className="h-3 w-3" />
              <span>{blog.author}</span>
            </div>
          )}

          {!isBlog && project.status && (
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className={cn("text-xs border", statusColors[project.status])}>
                {React.createElement(statusIcons[project.status], { className: "h-3 w-3 mr-1" })}
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(isBlog ? blog.tags : project.technologies)?.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
            >
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
          {(isBlog ? blog.tags : project.technologies)?.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
              +{(isBlog ? blog.tags : project.technologies).length - 3} more
            </Badge>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {content.category}
            </Badge>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link to={linkPath}>
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                Read More
              </Button>
            </Link>
            
            {!isBlog && project.demoUrl && (
              <Button size="sm" variant="ghost" className="h-8 px-2" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
            
            {!isBlog && project.githubUrl && (
              <Button size="sm" variant="ghost" className="h-8 px-2" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
