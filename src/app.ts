//app.ts

import express, { type ErrorRequestHandler } from 'express';
import { createTask, deleteTask, getTasks, getTasksById, updateTask } from './controllers/tasks.controller.js';

export const app = express();

app.use(express.json());

app.get('/tasks', getTasks);
app.get('/tasks/:id', getTasksById);
app.post('/tasks', createTask);
app.patch('/tasks/:id', updateTask);
app.delete('/tasks/:id', deleteTask)

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
};

app.use(errorHandler);



