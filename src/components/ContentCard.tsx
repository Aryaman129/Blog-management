
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContentCardProps {
  item: any;
  type: 'blog' | 'project';
}

export function ContentCard({ item, type }: ContentCardProps) {
  // Use slug if available, otherwise fallback to id, but ensure it's properly formatted as a slug
  const itemSlug = item.slug || (typeof item.id === 'string' ? item.id : String(item.id));
  const linkPath = type === 'blog' ? `/blog/${itemSlug}` : `/project/${itemSlug}`;

  console.log('ContentCard rendering:', { 
    itemId: item.id, 
    itemSlug: item.slug, 
    finalSlug: itemSlug, 
    linkPath: linkPath,
    type: type 
  });

  return (
    <Card className="group overflow-hidden border-0 bg-surface/50 backdrop-blur-sm hover:bg-surface/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
              {type === 'blog' ? item.excerpt : item.description}
            </p>
          </div>
          {item.featured && (
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
            <span>{item.date}</span>
          </div>
          
          {type === 'blog' && item.readTime && (
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
        <div className="flex flex-wrap gap-1 mb-4">
          {(type === 'blog' ? item.tags : item.technologies)?.slice(0, 3).map((tag: string, index: number) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-surface hover:bg-surface-elevated transition-all duration-300 hover:scale-110"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {tag}
            </Badge>
          ))}
          {(type === 'blog' ? item.tags?.length > 3 : item.technologies?.length > 3) && (
            <Badge variant="secondary" className="text-xs bg-surface/50">
              +{(type === 'blog' ? item.tags?.length : item.technologies?.length) - 3}
            </Badge>
          )}
        </div>

        {/* Project-specific info */}
        {type === 'project' && item.status && (
          <div className="mb-4">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                item.status === 'completed' 
                  ? 'text-green-400 border-green-500/30 bg-green-500/10' 
                  : item.status === 'in-progress'
                  ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                  : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
              } hover:scale-110 transition-transform duration-300`}
            >
              {item.status.replace('-', ' ')}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <Link to={linkPath}>
          <Button className="gradient-primary text-white hover:scale-105 transition-transform duration-300">
            {type === 'blog' ? 'Read More' : 'View Project'}
          </Button>
        </Link>
        
        {type === 'project' && (
          <div className="flex space-x-2">
            {item.demoUrl && (
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-300" asChild>
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {item.githubUrl && (
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-300" asChild>
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
