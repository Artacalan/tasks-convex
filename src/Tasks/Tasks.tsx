"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Tasks() {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateTaskStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleCreateTask = async () => {
    await createTask({ name: newTaskName, description: newTaskDescription, status: "à faire" });
    setNewTaskName("");
    setNewTaskDescription("");
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskStatus({ id: taskId, status: newStatus });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask({ id: taskId });
  };

  return (
    <div className="task-board">
      <h1>Tableau des Tâches</h1>
      <div className="task-creation">
        <input
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Nom de la tâche"
        />
        <input
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Description"
        />
        <Button onClick={handleCreateTask}>Créer Tâche</Button>
      </div>

      <div className="flex flex-row gap-2 w-full">
        {["à faire", "en cours", "terminé"].map((status) => (
          <div key={status} className="column">
            <h2>{status}</h2>
            {tasks
              ?.filter((task) => task.status === status)
              .map((task) => (
                <div key={task._id} className="task">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  {(status === "à faire" || status === "en cours") && <Button onClick={() => handleStatusChange(task._id!, status === "à faire" ? "en cours" : "terminé")}>
                    {status === "à faire" ? "Commencer" : "Terminer"}
                  </Button>}
                  <Button onClick={() => handleDeleteTask(task._id!)}>Supprimer</Button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
