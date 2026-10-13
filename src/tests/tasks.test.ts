import { test, expect, describe, afterAll, beforeAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

test('GET /tasks devuelve 200 por get exitoso', async()=>{
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
})



describe('GET /tasks/:id', ()=>{

    test.each([{caso: "devuelve 400 por ID invalido en forma de texto", id: "abc", expectedStatus:400}, 
               {caso: "Get /tasks/2147483647 devuelve error 404 (por obtener un ID inexistente)", id: 2147483647, expectedStatus:404},
               {caso: "Get /tasks/2147483648 devuelve error 400 por ingresar un id fuera de rango", id: 2147483648, expectedStatus:400}])("PRUEBA: $caso", async({id, expectedStatus})=>{

                const getById = await request(app).get(`/tasks/${id}`);

               expect(getById.status).toBe(expectedStatus);
               expect(getById.body.error).toBeTypeOf("string");

               });
});



describe('POST /tasks creacion de tareas', ()=>{

    const arrayIds: number[] = []; 
    

    test('POST /tasks debe devolver status 201 (creacion exitosa)', async()=>{

        const taskTitle = "Aprender a Testear"
 
        const response = await request(app).post('/tasks').send( {"title":taskTitle });

        const idCreatedTask = response.body?.task?.id;
        if(idCreatedTask) arrayIds.push(idCreatedTask);

        expect(response.status).toBe(201);

        expect(response.body.task.title).toBe(taskTitle);
    });

    test('titulo de 2 caracteres devuelve 201', async()=>{

        const min = await request(app).post('/tasks').send( {"title":"aa" });

        const id = min.body?.task?.id;
        if(id) arrayIds.push(id);

        expect(min.status).toBe(201)
        expect(min.body.task.title).toBe("aa")
        
    });

    test.each([{caso:'numero', body: {title: 155160}}, {caso:'null', body: {title: null}}, {caso:'no cumple minimo', body: {title: "a"}}, {caso:'sin title', body: {}}, {caso:'string vacio', body: {title: ""}}, {caso:'booleano', body: {title: true}} ])('POST /tasks con datos invalidos casos: $caso', async({body})=>{
        const response = await request(app).post('/tasks').send(body);

        const id = response.body?.task?.id;
        if(id) arrayIds.push(id);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTypeOf("string");
    })


    afterAll(async()=>{

        for(const idTask of arrayIds){

            await request(app).delete(`/tasks/${idTask}`);
            
        }
        
    });

})

describe('DELETE /tasks/:id', ()=>{

    let idCreatedTask:number;
    //util para crear el dato de prueba que luego vamos a eliminar
    beforeAll(async()=>{
        const response = await request(app).post('/tasks').send( {"title": "Aprender a Testear"});

        idCreatedTask = response.body?.task?.id;

        expect(response.status).toBe(201);

        
    })
    
    test('eliminar tarea creada, respuesta 200 de status', async()=>{
        const response = await request(app).delete(`/tasks/${idCreatedTask}`);

        expect(response.status).toBe(200);

        //verificar que la prueba recientemente eliminada se borró

        const deletedTask = await request(app).get(`/tasks/${idCreatedTask}`);
        expect(deletedTask.status).toBe(404);
        expect(deletedTask.body.error).toBeTypeOf("string");

    });


    test('intentar eliminar tarea que no existe, respuesta 404 de status', async()=>{
        const response = await request(app).delete(`/tasks/2147483647`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBeTypeOf("string");
    });

    afterAll(async()=>{
        if(idCreatedTask){
            await request(app).delete(`/tasks/${idCreatedTask}`);
        }
    })

});

describe('PATCH /tasks Actualizacion de tareas', ()=>{

    let idCreatedTask: number;
    const tituloOriginal = "Aprender a programar LLMs";

    beforeEach(async()=>{
        const response = await request(app).post('/tasks').send({title: tituloOriginal});

        idCreatedTask = response.body?.task?.id;

        expect(response.status).toBe(201);
    })

    const tituloNuevo = "Aprender a ser genial";

    test.each([{caso: "actualizar solo titulo ", body: {title: tituloNuevo}, esperado: {title: tituloNuevo, completed: false}}, 
               {caso: "Actualizar solo el completed", body: {completed:true}, esperado: {title:tituloOriginal, completed:true}},
               {caso: "Actualizar el completed y el title", body: {title: tituloNuevo, completed:true}, esperado: {title:tituloNuevo, completed:true}},
               {caso: "actualizar el titulo con 'aa'", body: {title: "   aa   "}, esperado: {title:"aa", completed:false}}])('exito en $caso status 200', async({body, esperado})=>{

                const response  = await request(app).patch(`/tasks/${idCreatedTask}`).send(body);

                expect(response.status).toBe(200);
                expect(response.body.task).toMatchObject(esperado);

                // lo nuevo: consultar la tarea otra vez para confirmar que se guardó
                const getResponse = await request(app).get(`/tasks/${idCreatedTask}`);

                expect(getResponse.status).toBe(200);
                expect(getResponse.body.task).toMatchObject(esperado);

    });


    test.each([{caso: "titulo no string", body: {title: 202}}, 
               {caso: "complted no boolean", body: {completed: "string"}}, 
               {caso: "body empty", body: {}},
               {caso: "titulo vacio con espacios", body: {title: "    "}},
               {caso: "titulo con un caracter con espacios", body: {title: "  a    "}},
               {caso: "titulo null", body: {title: null}},
               {caso: "clave desconocida", body: {foo: "  a    "}}
                ])("actualizar tarea con datos invalidos: $caso",async({body})=>{
 
        const response  = await request(app).patch(`/tasks/${idCreatedTask}`).send(body);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTypeOf("string");

    })


    test.each([{caso: "titulo correcto con id inexistente", body: {title: "Nueva Tarea"}}, 
               {caso: "completed de false a true con id inexistente", body: {completed: true}}])('actualizacion con id inexistente: $caso', async({body})=>{
        const response  = await request(app).patch(`/tasks/2147483647`).send(body);

        expect(response.status).toBe(404);
        expect(response.body.error).toBeTypeOf("string");
    });

    test.each([{caso: "titulo correcto con id no numerico", body: {title: "Nueva Tarea"}}, 
               {caso: "completed de false a true con id no numerico", body: {completed: true}}])('actualizacion con id no numerico: $caso', async({body})=>{
        const response  = await request(app).patch(`/tasks/abc`).send(body);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTypeOf("string");
    });

    afterEach(async()=>{
        if(idCreatedTask){

            await request(app).delete(`/tasks/${idCreatedTask}`);

        }
    })

})

