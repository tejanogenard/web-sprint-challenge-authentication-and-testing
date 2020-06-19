
const server = require('../api/server');
const supertest = require('supertest');
const db = require('../database/dbConfig');

describe('auth-router.js', () => {
  // register user

  describe('POST /register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });

    it('should return hash password', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({ username: "ivan", password: "pass"})
        .then(res => {
          expect(res.body.data.password).not.toBe('ivan');
        })
    })

    it('should register a new user', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({ username: "ivan", password: "pass" })
        .then(res => {
          expect(res.status).toBe(201);
        })
    })

  })
  //login 
  describe('POST /login', () => {
    it('should return 400 if sent no credentials', () => {
        return supertest(server).post('/api/auth/login')
        .send({})
        .then(res => {
            expect(res.status).toBe(400);
        });
    });
    
    it('should not login if the user credentials are invalid' ,() => {
        return supertest(server)
          .post('/api/auth/login')
          .send({ username: "ivan", password: "password"})
          .then(res => {
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid credentials")
          })
      })
})



  // GET JOKES
  describe('GET to /api/jokes', () => {
    it('should get a list of jokes', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({ username: "ivan", password: "pass"})
        .then(res => {
         let token = res.body.token;
          return supertest(server)
            .get('/api/jokes')
            .set('Authorization', token)
            .then(res => {
              expect(res.body).toHaveLength(20);
            })
        })
    })

    it('should not return jokes if not authorized', () => {
          return supertest(server)
            .get('/api/jokes')
            .then(res => {
              expect(res.status).toBe(401);
            })
        })
    })
  })
