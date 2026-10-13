//tasks.model.ts

import { Query } from 'pg';
import {pool} from '../db.js'

export const getTasksModel = async() =>{
    const result = await pool.query('SELECT * FROM tasks')

    return result.rows;
}

export const getTaskByIdModel = async(id: number)=>{
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if(result.rowCount == 0){
      return null
    }
    
    return result.rows[0];
}

export const createTaskModel = async(title: string) =>{
    const response = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]);
    return response.rows[0];
}

export const updateTaskModel = async(id: number, title?:string, completed?:boolean) =>{
  
  let result;

  if(title == undefined && completed != undefined){
    result = await pool.query('UPDATE tasks SET completed=$1 WHERE id=$2 RETURNING *', [completed, id]);
    
  }else if(title != undefined && completed != undefined){
    result = await pool.query('UPDATE tasks SET completed=$1, title=$2 WHERE id=$3 RETURNING *', [completed, title, id]);
    
  }else{
    result = await pool.query('UPDATE tasks SET title=$1  WHERE id=$2 RETURNING *', [title, id]);
  }

  if(result.rowCount == 0){
    return null;
  }
   return result.rows[0];
}

export const deleteTaskModel = async(id:number)=>{
   const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
   if(result.rowCount == 0){
       return null;
   }
   return result.rows[0];
}