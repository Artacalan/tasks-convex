import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api"; // En supposant que api est ton API générée automatiquement
import schema from "./schema"; // Ton fichier de schéma, assure-toi qu'il est correct

test("création d'une tâche", async () => {
  const t = convexTest(schema);

  // Création d'une tâche avec le statut "à faire"
  const taskData = {
    name: "Tâche de test 1",
    description: "Ceci est une tâche de test",
    status: "à faire"
  };
  
  await t.mutation(api.tasks.create, taskData);

  // Requête pour récupérer les tâches
  const tasks = await t.query(api.tasks.list);

  // Vérifier que la tâche créée est présente
  expect(tasks).toContainEqual(expect.objectContaining({
    name: "Tâche de test 1",
    description: "Ceci est une tâche de test",
    status: "à faire"
  }));
});

test("liste des tâches", async () => {
  const t = convexTest(schema);

  // Créer des tâches avec différents statuts
  await t.mutation(api.tasks.create, {
    name: "Tâche de test 1",
    description: "Description de la première tâche",
    status: "à faire"
  });
  await t.mutation(api.tasks.create, {
    name: "Tâche de test 2",
    description: "Description de la deuxième tâche",
    status: "terminé"
  });

  // Requête pour lister les tâches et trier par nom
  const tasks = await t.query(api.tasks.list);
  tasks.sort((a, b) => a.name.localeCompare(b.name)); // Trie les tâches par nom pour s'assurer de l'ordre

  // Vérifier que les tâches sont bien retournées
  expect(tasks).toHaveLength(2);
  expect(tasks[0]).toMatchObject({
    name: "Tâche de test 1",
    description: "Description de la première tâche",
    status: "à faire"
  });
  expect(tasks[1]).toMatchObject({
    name: "Tâche de test 2",
    description: "Description de la deuxième tâche",
    status: "terminé"
  });
});


test("mise à jour du statut d'une tâche", async () => {
  const t = convexTest(schema);

  // Créer une tâche avec le statut "à faire"
  const task = await t.mutation(api.tasks.create, {
    name: "Tâche à mettre à jour",
    description: "Description de la tâche",
    status: "à faire"
  });

  const tasks = await t.query(api.tasks.list);

  // Mettre à jour le statut de la tâche vers "en cours"
  await t.mutation(api.tasks.updateStatus, { id: tasks[0]._id, status: "en cours" });

  // Requête pour obtenir la tâche mise à jour
  const updatedTask = await t.query(api.tasks.list);

  // Vérifier que le statut a été mis à jour
  expect(updatedTask[0].status).toBe("en cours");
});

test("suppression d'une tâche", async () => {
  const t = convexTest(schema);

  // Créer une tâche avec le statut "à faire"
  const task = await t.mutation(api.tasks.create, {
    name: "Tâche à supprimer",
    description: "Description de la tâche",
    status: "à faire"
  });

  const tasks = await t.query(api.tasks.list);
  const idToRemember = tasks[0]._id

  // Supprimer la tâche
  await t.mutation(api.tasks.deleteTask, { id: idToRemember});

  // Requête pour vérifier que la tâche a bien été supprimée

  // Vérifier que la tâche n'est plus dans la liste
  expect(tasks).not.toContainEqual(expect.objectContaining({ id: idToRemember }));
});
