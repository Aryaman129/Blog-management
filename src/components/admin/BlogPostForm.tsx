
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/hooks/useAuthStore';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be less than 50 characters'),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogPost?: any;
}

const BlogPostForm = ({ isOpen, onClose, onSuccess, blogPost }: BlogPostFormProps) => {
  const { token } = useAuthStore();
  const { toast } = useToast();
  const isEditing = !!blogPost;

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: blogPost?.title || '',
      excerpt: blogPost?.excerpt || '',
      content: blogPost?.content || '',
      author: blogPost?.author || 'Admin',
      category: blogPost?.category || '',
      tags: Array.isArray(blogPost?.tags) ? blogPost.tags.join(', ') : (blogPost?.tags || ''),
      featured: blogPost?.featured || false,
      published: blogPost?.published !== false,
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    if (!token) return;

    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        readTime: '5 min read', // Default read time
      };

      console.log('Submitting blog post with payload:', payload);
      console.log('Using token:', token ? 'Token present' : 'No token');

      if (isEditing) {
        await apiClient.updateBlogPost(blogPost.id, payload, token);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        await apiClient.createBlogPost(payload, token);
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Blog post creation/update error:', error);
      
      let errorMessage = `Failed to ${isEditing ? 'update' : 'create'} blog post`;
      
      // Check for authentication errors
      if (error.message?.includes('token') || error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Authentication failed. Please log in again.';
        // Optionally auto-logout the user
        // useAuthStore.getState().logout();
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the blog post details below.' : 'Fill in the details to create a new blog post.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief excerpt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the full blog post content" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology, Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Separate tags with commas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Featured Post
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Published
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Blog Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
