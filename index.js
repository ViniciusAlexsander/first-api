const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

//middleware para verificar se existe um erro
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found " });
  }

  return next();
}

//middleware global para imprime uma contagem td vez q alguem chama uma req
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

//cria os projetos
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//lista todos os projetos e tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//a altera o titulo do projeto ARRUMAR
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(id, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});
server.listen(3333);
