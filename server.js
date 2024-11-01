const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const filepath = path.join(__dirname, 'tasks.json');

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load tasks
function loadTasks() {
    if (!fs.existsSync(filepath)){
        return [];
    }
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
}

// Save tasks
function saveTasks(tasks) {
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2));
}

// Endpoints
app.get('/tasks', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length + 1,
        description: req.body.description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        task.description = req.body.description;
        task.updateAt = new Date().toISOString();
        saveTasks(tasks);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/tasks/:id', (req, res) => {
    let tasks = loadTasks();
    tasks = tasks.filter(t => t.id != req.params.id);
    saveTasks(tasks);
    res.send('Task deleted successfully');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
