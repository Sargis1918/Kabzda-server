
import { app, } from "../../src/app";
import { HTTP_STATUSES } from "../../src/utilite";
import request from 'supertest'
import { CourseCreateModel } from "../../src/models/CourseCreateModel";
describe('/courses',()=>{
  beforeAll(async()=>{
    await request(app).delete('/__test__/data')
  })
  it('should return status 200 and empty array',async()=>{
      const response= await request(app).get('/courses');
        expect(response.status).toBe(HTTP_STATUSES.ok_200)
        expect(response.body).toEqual([])
    })
    it('should return status 404 and empty array',async()=>{
      const response= await request(app).get('/courses/00000');
        expect(response.status).toBe(HTTP_STATUSES.not_found_404)
        
    })
    it('should`nt create course with correct input data',async()=>{
      let data:CourseCreateModel={title:""}
      await request(app).post('/courses') 
      .send(data)
      expect(HTTP_STATUSES.bad_request_400)
      
      const response= await request(app).get('/courses');
        expect(response.status).toBe(HTTP_STATUSES.ok_200)
        expect(response.body).toEqual([])
    })
    let createdCourse:any= null
    it('should create course with correct input data',async()=>{
      let data:CourseCreateModel={title:"komitas-2"}
      await request(app).post('/courses') 
      
      .send(data)
     expect(HTTP_STATUSES.created_201)
     const response=await request(app).get('/courses')
      createdCourse=response.body
     expect(createdCourse).toEqual([{id:expect.any(Number),title:data.title}])
  
     
    
      })
      it('should`nt update course with incorrect input data',async()=>{
       let data:CourseCreateModel={title:""}
        await request(app).put('/courses/'+createdCourse.id) 
        .send(data)
        expect(HTTP_STATUSES.bad_request_400)
      })
      afterAll(done=>{
        done()
      })
})