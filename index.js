const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let requests = 0;

//Verifica se existe id no req.params
function checkId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(projeto => projeto.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Id Required' });
  }

  return next();
}

//Número de Requisições
function numberRequests(req, res, next) {
  requests++;

  console.log(`Número de requisições: ${requests}`);

  return next();
}

server.use(numberRequests);

//Método POST para criar o projeto
server.post('/projects', (req, res) =>{
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks:[]
  };

  projects.push(project);

  return res.json(project);
});

//Método GET
server.get('/projects/', (req, res) =>{

  return res.json(projects);
});

//Método PUT
server.put('/projects/:id', checkId, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(projeto => projeto.id == id);

  project.title = title;

  return res.json(project);
});

//Método DELETE
server.delete('/projects/:id', checkId, (req, res) =>{
  const { id } = req.params;

  const valorId = projects.findIndex(projeto => projeto.id == id);

  projects.splice(valorId, 1);

  //retorna apenas uma resposta de OK do servidor
  return res.send();
})

//Tasks
server.post('/projects/:id/tasks', checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(projeto => projeto.id == id);

  project.tasks.push(title);

  return res.json(project);
});



server.listen(3000);