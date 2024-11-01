const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

const filepath = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(filepath)) {
        return [];
    }
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
}

function saveTasks(tasks) {
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2));
}

function addTask(description) {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length + 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

function updateTask(id, description) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.description = description;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${id} updated successfully`);
    } else {
        console.log(`Task ${id} not found`);
    }
}

function deleteTask(id) {
    let tasks = loadTasks();
    tasks = tasks.filter(t => t.id != id);
    saveTasks(tasks);
    console.log(`Task ${id} deleted successfully`);
}

function markTask(id, status) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${id} marked as ${status}`);
    } else {
        console.log(`Task ${id} not found`);
    }
}

function listTasks(status) {
    const tasks = loadTasks();
    const filteredTasks = status ? tasks.filter(t => t.status === status) : tasks;
    console.log(filteredTasks);
}

// Command handling
const command = args[0];
switch (command) {
    case 'add':
        addTask(args[1]);
        break;
    case 'update':
        updateTask(args[1], args[2]);
        break;
    case 'delete':
        deleteTask(args[1]);
        break;
    case 'mark-in-progress':
        markTask(args[1], 'in-progress');
        break;
    case 'mark-done':
        markTask(args[1], 'done');
        break;
    case 'list':
        listTasks(args[1]);
        break;
    default:
        console.log('Unknown command');
}
