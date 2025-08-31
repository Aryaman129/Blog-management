
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBlogPosts } from '@/hooks/useApi';
import { useAuthStore } from '@/hooks/useAuthStore';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import BlogPostForm from './BlogPostForm';

const BlogManager = () => {
  const { token } = useAuthStore();
  const { data: blogPosts = [], isLoading, refetch } = useBlogPosts();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [previewPost, setPreviewPost] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    setIsDeleting(id);
    try {
      await apiClient.deleteBlogPost(id, token);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleView = (post: any) => {
    setPreviewPost(post);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleClosePreview = () => {
    setPreviewPost(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading blog posts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Blog Posts</h2>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleNewPost}>
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="grid gap-4">
          {blogPosts.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">No blog posts found</p>
              </CardContent>
            </Card>
          ) : (
            blogPosts.map((post: any) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.featured && <Badge variant="secondary">Featured</Badge>}
                      {post.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>{post.readTime}</span>
                      <span>{post.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(post)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BlogPostForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        blogPost={editingPost}
      />

      <Dialog open={!!previewPost} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewPost?.title}</DialogTitle>
            <DialogDescription>
              By {previewPost?.author} • {previewPost?.readTime} • {previewPost?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {previewPost?.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground font-medium">{previewPost?.excerpt}</p>
              <div className="whitespace-pre-wrap mt-4">{previewPost?.content}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogManager;
