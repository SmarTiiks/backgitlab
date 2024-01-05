const request = require('supertest')
const app = require('./app')

describe('Express API', () => {
    it('GET /blogs --> array blogs', () => {
        return request(app)
            .get('/blogs')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            sujet: expect.any(String),
                            description: expect.any(String),
                        })
                    ])
                )
            })
    })

    it('GET /blog/id --> specific blog by ID', () => {
        return request(app)
            .get('/blog/6572f09fe3b3e5e12f44340c')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        sujet: expect.any(String),
                        description: expect.any(String),
                    })
                )
            })
    })

    it('GET /blog/id --> 404 if not found', () => {
        return request(app)
            .get('/blog/1')
            .expect(404)
    })

    it('POST /submit-post --> create blog', () => {
        return request(app)
            .post('/submit-post')
            .send({
                sujet: 'test',
                description: 'test',
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String)
                    })
                )
            })
    })
})