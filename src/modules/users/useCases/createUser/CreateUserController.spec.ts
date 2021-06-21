import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm'
import { app } from '../../../../app';

let connection: Connection

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('Should be able to create an user', async () => {
    const name = 'supertest'
    const email = 'email@email.com'
    const password = '123456'

    const response = await request(app).post('/api/v1/users').send({
      name,
      email,
      password
    })

    expect(response.status).toBe(201)
  })
})
