import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Loader2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Project, Task, TaskCreate, TaskStatus } from '../types';

interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
}

const statusConfig: Record<TaskStatus, StatusConfig> = {
  'Todo': { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
  'In Progress': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Done': { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<TaskCreate>({ title: '', description: '' });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    if (!projectId) return;
    
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get<Project>(`/projects/${projectId}`),
        api.get<Task[]>(`/projects/${projectId}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error: any) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectId) return;
    
    setCreating(true);

    try {
      const response = await api.post<Task>(`/projects/${projectId}/tasks`, newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setOpen(false);
      toast.success('Task created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await api.patch<Task>(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      toast.success('Task status updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update task');
    }
  };

  const groupedTasks: Record<TaskStatus, Task[]> = {
    'Todo': tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-spinner">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-4 -ml-2"
            data-testid="back-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" data-testid="project-title">{project?.name}</h1>
              {project?.description && (
                <p className="text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-sm hover:shadow-md active:scale-95" data-testid="create-task-button">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white" data-testid="create-task-dialog">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to this project
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Implement login feature"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                      data-testid="task-title-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description (optional)</Label>
                    <Input
                      id="task-description"
                      placeholder="Add authentication with JWT"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      data-testid="task-description-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full shadow-sm hover:shadow-md active:scale-95"
                    disabled={creating}
                    data-testid="task-submit-button"
                  >
                    {creating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      'Create Task'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content - Kanban Board */}
      <main className="container mx-auto px-6 py-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4" data-testid="empty-tasks-state">
            <Circle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No tasks yet</h3>
              <p className="text-sm text-muted-foreground">Create your first task to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3" data-testid="tasks-board">
            {(Object.entries(groupedTasks) as [TaskStatus, Task[]][]).map(([status, statusTasks]) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              
              return (
                <div key={status} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <h2 className="text-lg font-semibold">{status}</h2>
                    <span className="text-sm text-muted-foreground">({statusTasks.length})</span>
                  </div>
                  <div className="space-y-3">
                    {statusTasks.map((task) => (
                      <Card
                        key={task.id}
                        data-testid={`task-card-${task.id}`}
                        className="
                          bg-card/80
                          backdrop-blur
                          border border-border/60
                          shadow-sm
                          transition-all
                          hover:shadow-md
                          hover:border-primary/40
                        "
                      >
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-medium" data-testid={`task-title-${task.id}`}>{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {new Date(task.created_at).toLocaleDateString()}
                            </p>
                            <Select
                              value={task.status}
                              onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs" data-testid={`task-status-select-${task.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todo">Todo</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}