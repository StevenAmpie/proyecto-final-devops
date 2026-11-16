const API_URL = '/api';

const statusBadge = document.getElementById('api-status');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      statusBadge.textContent = 'Backend Conectado (ECS Fargate)';
      statusBadge.className = 'status-badge online';
    } else {
      throw new Error('Error en respuesta');
    }
  } catch (error) {
    statusBadge.textContent = 'Backend Desconectado';
    statusBadge.className = 'status-badge offline';
  }
}

async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Error al cargar tareas:', error);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const span = document.createElement('span');
    span.className = `task-title ${task.completed ? 'completed' : ''}`;
    span.textContent = task.title;
    span.onclick = () => toggleTask(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (response.ok) {
      taskInput.value = '';
      fetchTasks();
    }
  } catch (error) {
    console.error('Error al crear tarea:', error);
  }
});

async function toggleTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'PATCH' });
    fetchTasks();
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
}

checkHealth();
fetchTasks();
