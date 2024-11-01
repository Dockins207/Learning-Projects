#!/usr/bin/env node
const fs = require('fs'); 
const path = require('path');

const filepath = path.join(__dirname, 'tasks.json');

const args = process.argv.slice(2);
const command = args[0];

switch(command) { 
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
        markTaskInProgress(args[1]);
        break;
    case 'mark-done':
        markTaskDone(args[1]);
        break;
    case 'list':
        listTasks(args[1]);
        break;
    default:
        console.log('Unknown command');
}

function loadTasks() {
    if (!fs.existsSync(filepath)){
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
        updateAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log('Task added successfully', newTask);
}

function updateTask(id, description) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.description = description;
        task.updateAt = new Date().toISOString();
        saveTasks(tasks);
        console.log('Task updated successfully', task);
    } else {
        console.log('Task not found');
    }
}

function deleteTask(id) {
    let tasks = loadTasks();
    tasks = tasks.filter(t => t.id != id);
    saveTasks(tasks);
    console.log('Task deleted successfully');
}

function markTaskInProgress(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.status = 'in-progress';
        task.updateAt = new Date().toISOString();
        saveTasks(tasks);
        console.log('Task marked as in-progress', task);
    } else {
        console.log('Task not found');
    }
}

function markTaskDone(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.status = 'done';
        task.updateAt = new Date().toISOString();
        saveTasks(tasks); 
        console.log('Task marked as done', task);
    } else {
        console.log('Task not found');
    }
}

function listTasks(status) {
    const tasks = loadTasks();
    const filteredTasks = status ? tasks.filter(t => t.status === status) : tasks;
    console.log(filteredTasks);
}
