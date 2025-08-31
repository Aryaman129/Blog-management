
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useApi';
import { useAuthStore } from '@/hooks/useAuthStore';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import ProjectForm from './ProjectForm';

const ProjectManager = () => {
  const { token } = useAuthStore();
  const { data: projects = [], isLoading, refetch } = useProjects();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [previewProject, setPreviewProject] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    setIsDeleting(id);
    try {
      await apiClient.deleteProject(id, token);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleView = (project: any) => {
    setPreviewProject(project);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleClosePreview = () => {
    setPreviewProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'planned':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading projects...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="text-muted-foreground">Manage your project portfolio</p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">No projects found</p>
              </CardContent>
            </Card>
            ) : (
            projects.map((project: any) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.featured && <Badge variant="secondary">Featured</Badge>}
                      <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {project.technologies?.map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.category}</span>
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                            <ExternalLink className="h-3 w-3" />
                            Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                            <Github className="h-3 w-3" />
                            Code
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(project)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={isDeleting === project.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <ProjectForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        project={editingProject}
      />

      <Dialog open={!!previewProject} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewProject?.title}</DialogTitle>
            <DialogDescription>
              {previewProject?.category} • Status: {previewProject?.status}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {previewProject?.technologies?.map((tech: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            
            {(previewProject?.demoUrl || previewProject?.githubUrl) && (
              <div className="flex items-center gap-4">
                {previewProject?.demoUrl && (
                  <a 
                    href={previewProject.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {previewProject?.githubUrl && (
                  <a 
                    href={previewProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                )}
              </div>
            )}
            
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground font-medium">{previewProject?.description}</p>
              <div className="whitespace-pre-wrap mt-4">{previewProject?.content}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectManager;
