import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Plus, FolderOpen, LogOut, Loader2 } from "lucide-react";
import { Project, ProjectCreate } from "../types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<ProjectCreate>({
    name: "",
    description: "",
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
    } catch (error: any) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await api.post<Project>("/projects", newProject);
      setProjects((prev) => [response.data, ...prev]);
      setNewProject({ name: "", description: "" });
      setOpen(false);
      toast.success("Project created successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create project"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="projects-heading">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="logout-button"
            className="shadow-sm hover:shadow-md active:scale-95"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div
            className="flex items-center justify-center h-64"
            data-testid="loading-spinner"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Create Project Button */}
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="shadow-sm hover:shadow-md active:scale-95"
                    data-testid="create-project-button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className="bg-white"
                  data-testid="create-project-dialog"
                >
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to organize your tasks
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handleCreateProject}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="My Awesome Project"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            name: e.target.value,
                          })
                        }
                        required
                        data-testid="project-name-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-description">
                        Description (optional)
                      </Label>
                      <Input
                        id="project-description"
                        placeholder="Brief description of your project"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            description: e.target.value,
                          })
                        }
                        data-testid="project-description-input"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full shadow-sm hover:shadow-md active:scale-95"
                      disabled={creating}
                      data-testid="project-submit-button"
                    >
                      {creating ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Create Project"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-64 space-y-4"
                data-testid="empty-state"
              >
                <FolderOpen className="h-16 w-16 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first project to get started
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                data-testid="projects-grid"
              >
                {projects.map((project) => (
                  <Card
                    key={project._id}
                    className="mx-auto w-full max-w-sm"
                    onClick={() =>
                      navigate(`/projects/${project._id}`)
                    }
                    data-testid={`project-card-${project._id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {project.name}
                      </CardTitle>
                      <CardDescription>
                        {project.description || "No description"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent />

                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                      >
                        Action
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}