//tasks.controller.ts

import { type Request, type Response } from "express";
import { getTasksModel, getTaskByIdModel, createTaskModel, updateTaskModel, deleteTaskModel } from "../models/tasks.model.js";
import { error } from "node:console";
import { taskParamsSchema, taskSchema, updateTaskSchema } from "../schema/taskSchema.js";

export const getTasks = async(req:Request, res:Response) =>{
    
    const result = await getTasksModel();
    res.status(200).json({tasks: result})
    
}

export const getTasksById = async(req: Request, res:Response) =>{

    
        
    const validateParams = taskParamsSchema.safeParse(req.params);
    if(!validateParams.success){
        res.status(400).json({error: "tipo de dato incorrecto, solo se permiten tipos de dato Number"});
        console.error({error: "el id proporcionado es de un tipo de dato incorrecto"})
        return;
    }

    const id = validateParams.data.id;
    const result = await getTaskByIdModel(id);
    if(result == 0){
        console.error({error: "el id proporcionado no existe en la base de datos"})
        res.status(400).json({error: "el id proporcionado no existe en la base de datos"});
        return;
    }
    res.status(200).json({task: result})
    
};

export const createTask = async(req: Request, res:Response) =>{
 

    const resultTitle = taskSchema.safeParse(req.body);
    if(!resultTitle.success){
        res.status(400).json(resultTitle.error.format());
        return;
    }
    const title = resultTitle.data?.title;
    await createTaskModel(title);
    res.status(201).json({mensaje: "¡tarea creada exitosamente!"})
    
};

export const updateTask = async(req: Request, res:Response) =>{
    
    const validateParams = taskParamsSchema.safeParse(req.params);
    const validateBody = updateTaskSchema.safeParse(req.body);
    if(!validateParams.success){
        res.status(400).json({error: "tipo de dato incorrecto, solo se permiten tipos de dato Number"});
        console.error({error: "el id proporcionado es de un tipo de dato incorrecto"})
        return;
    }
    if(!validateBody.success){
        res.status(400).json({error: "hay un tipo de dato incorrecto"});
        console.error({error: "hay un tipo de dato incorrecto"})
        return;
    }

    const id = validateParams.data.id;
    const title = validateBody.data.title;
    const completed = validateBody.data.completed;

    const result = await updateTaskModel(id, title, completed);
    if(result == 0){
        res.status(400).json({error: "tarea con id ingresado no existe"});
        return;
    }
    res.status(201).json({mensaje: "¡tarea actualizada exitosamente!"})
}
    

export const deleteTask = async(req: Request, res:Response) =>{
    
    const validateParams = taskParamsSchema.safeParse(req.params);
    if(!validateParams.success){
        res.status(400).json({error: "tipo de dato incorrecto, solo se permiten tipos de dato Number"});
        console.error({error: "el id proporcionado es de un tipo de dato incorrecto"})
        return;
    }

    const id = validateParams.data.id;
    const result = await deleteTaskModel(id);
    if(result == 0){
        res.status(400).json({error: "tarea con id ingresado no existe"});
        console.error({error: 'tarea a eliminar no existe'})
        return;
    }
    res.status(204).json({mensaje: "¡tarea elimanda exitosamente!", deletedTask: result})
    
};