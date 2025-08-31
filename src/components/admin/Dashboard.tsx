
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, Image, TrendingUp } from 'lucide-react';
import { useItems } from '@/hooks/useApi';

const Dashboard = () => {
  const { data: allItems = [], isLoading } = useItems();
  const { data: blogPosts = [] } = useItems({ type: 'blog' });
  const { data: projects = [] } = useItems({ type: 'project' });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const featuredCount = allItems.filter(item => item.featured).length;

  const stats = [
    {
      title: 'Total Posts',
      value: blogPosts.length,
      description: 'Published blog posts',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Projects',
      value: projects.length,
      description: 'Portfolio projects',
      icon: FolderOpen,
      color: 'text-green-600',
    },
    {
      title: 'Featured Content',
      value: featuredCount,
      description: 'Featured items',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      title: 'Total Content',
      value: allItems.length,
      description: 'All content items',
      icon: Image,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your content and activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Latest published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blogPosts.slice(0, 5).map((post: any) => (
                <div key={post.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.category}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest portfolio items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.status}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
