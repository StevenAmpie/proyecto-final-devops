const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: 'Desplegar infraestructura con Terraform', completed: true },
  { id: 2, title: 'Construir y publicar imagenes en Amazon ECR', completed: true },
  { id: 3, title: 'Verificar despliegue continuo en Amazon ECS', completed: false }
];
let nextId = 4;

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'backend-api',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El titulo de la tarea es obligatorio' });
  }
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  task.completed = !task.completed;
  res.status(200).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Backend ejecutandose en el puerto ${PORT}`);
});
