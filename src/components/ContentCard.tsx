
import { Calendar, Clock, User, ExternalLink, Github, Tag, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ContentCardProps {
  item: any;
  type?: 'blog' | 'project';
}

export default function ContentCard({ item, type }: ContentCardProps) {
  // Determine the type if not provided
  const itemType = type || (item.excerpt ? 'blog' : 'project');
  
  // Create the correct navigation path using slug
  const linkPath = itemType === 'blog' ? `/blog/${item.slug}` : `/project/${item.slug}`;

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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border/40 hover:border-primary/40">
      <CardHeader className="space-y-4">
        {/* Featured Badge */}
        {item.featured && (
          <Badge className="self-start gradient-primary text-white border-0 animate-pulse">
            Featured
          </Badge>
        )}

        {/* Project Status Badge */}
        {itemType === 'project' && item.status && (
          <Badge 
            variant="secondary" 
            className={cn("flex items-center space-x-1 self-start hover:scale-110 transition-transform duration-300", statusColors[item.status])}
          >
            {React.createElement(statusIcons[item.status], { className: "h-3 w-3" })}
            <span>{item.status.replace('-', ' ')}</span>
          </Badge>
        )}

        {/* Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <div className="text-4xl opacity-20 animate-pulse">
            {itemType === 'blog' ? '📝' : '💻'}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>

        {/* Description/Excerpt */}
        <p className="text-muted-foreground line-clamp-3 group-hover:text-foreground transition-colors duration-300">
          {itemType === 'blog' ? item.excerpt : item.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {itemType === 'blog' && item.author && (
            <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
              <User className="h-3 w-3" />
              <span>{item.author}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
            <Calendar className="h-3 w-3" />
            <span>{item.date}</span>
          </div>

          {itemType === 'blog' && item.readTime && (
            <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
              <Clock className="h-3 w-3" />
              <span>{item.readTime}</span>
            </div>
          )}

          {item.category && (
            <div className="flex items-center space-x-1 hover:text-primary transition-colors duration-300">
              <Tag className="h-3 w-3" />
              <span>{item.category}</span>
            </div>
          )}
        </div>

        {/* Tags/Technologies */}
        <div className="flex flex-wrap gap-2">
          {(itemType === 'blog' ? item.tags : item.technologies)?.slice(0, 3).map((tag: string, index: number) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-surface hover:bg-surface-elevated transition-all duration-300 hover:scale-110"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tag}
            </Badge>
          ))}
          {(itemType === 'blog' ? item.tags?.length : item.technologies?.length) > 3 && (
            <Badge variant="secondary" className="bg-surface text-muted-foreground">
              +{(itemType === 'blog' ? item.tags.length : item.technologies.length) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        {/* Read More / View Project Button */}
        <Button asChild className="flex-1 mr-2 hover:scale-105 transition-transform duration-300">
          <Link to={linkPath}>
            {itemType === 'blog' ? 'Read More' : 'View Project'}
          </Link>
        </Button>

        {/* Project External Links */}
        {itemType === 'project' && (
          <div className="flex space-x-2">
            {item.demoUrl && (
              <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform duration-300" asChild>
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {item.githubUrl && (
              <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform duration-300" asChild>
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
