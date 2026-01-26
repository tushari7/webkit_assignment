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
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState<ProjectCreate>({
    name: "",
    description: "",
  });

  const isEditMode = Boolean(editingProject);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ===================== API ===================== */

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get<Project[]>("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      if (isEditMode && editingProject) {
        const res = await api.put<Project>(
          `/projects/${editingProject._id}`,
          {
            name: editingProject.name,
            description: editingProject.description,
          }
        );

        setProjects((prev) =>
          prev.map((p) => (p._id === res.data._id ? res.data : p))
        );

        toast.success("Project updated successfully");
      } else {
        const res = await api.post<Project>("/projects", newProject);

        setProjects((prev) => [res.data, ...prev]);
        toast.success("Project created successfully");
      }

      setOpen(false);
      setEditingProject(null);
      setNewProject({ name: "", description: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Create / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProject(null);
                    setOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit Project" : "Create New Project"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update project details"
                      : "Add a new project"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      value={
                        isEditMode
                          ? editingProject?.name ?? ""
                          : newProject.name
                      }
                      onChange={(e) =>
                        isEditMode
                          ? setEditingProject((prev) =>
                              prev
                                ? { ...prev, name: e.target.value }
                                : prev
                            )
                          : setNewProject((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={
                        isEditMode
                          ? editingProject?.description ?? ""
                          : newProject.description
                      }
                      onChange={(e) =>
                        isEditMode
                          ? setEditingProject((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    description: e.target.value,
                                  }
                                : prev
                            )
                          : setNewProject((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={creating}
                  >
                    {creating
                      ? "Saving..."
                      : isEditMode
                      ? "Update Project"
                      : "Create Project"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <FolderOpen className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No projects yet
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card
                    key={project._id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/projects/${project._id}`)
                    }
                  >
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {project.description || "No description"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent />

                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id);
                        }}
                      >
                        Delete
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