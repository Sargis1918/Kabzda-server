import exp from "constants";
import { app, HTTP_STATUSES } from "../../src";
import request from 'supertest'
describe('/address',()=>{
  beforeAll(async()=>{
    await request(app).delete('/__test__/data')
  })
  it('should return status 200 and empty array',async()=>{
      const response= await request(app).get('/address');
        expect(response.status).toBe(HTTP_STATUSES.ok_200)
        expect(response.body).toEqual([])
    })
    it('should return status 200 and empty array',async()=>{
      const response= await request(app).get('/address/00000');
        expect(response.status).toBe(HTTP_STATUSES.not_found_404)
        
    })
    it('should`nt create course with correct input data',async()=>{
      await request(app).post('/address') 
      .send({title:""})
      expect(HTTP_STATUSES.bad_request_400)
      
      const response= await request(app).get('/address');
        expect(response.status).toBe(HTTP_STATUSES.ok_200)
        expect(response.body).toEqual([])
    })
    it('should create course with correct input data',async()=>{
      await request(app).post('/address') 
      
      .send({title:"komitas-2"})
     expect(HTTP_STATUSES.created_201)
     const response=await request(app).get('/address')
     expect(response.body).toEqual([{id:expect.any(Number),title:'komitas-2'}])
  
     
    
      })
      it('should`nt update course with incorrect input data',async()=>{
        await request(app).put('/product/3') 
        .send({title:""})
        expect(HTTP_STATUSES.bad_request_400)
        
        
      })
      
})