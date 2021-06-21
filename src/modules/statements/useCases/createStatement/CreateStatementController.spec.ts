import { app } from "../../../../app"
import createConnection from '../../../../database'
import { Connection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { hash } from 'bcryptjs'
import request from 'supertest'

let connection: Connection

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection
    await connection.runMigrations()

    const userId = uuidV4()
    const password = await hash('password', 8)

    await connection.query(`
      INSERT INTO users(id, name, email, password)
      VALUES ('${userId}', 'supertest', 'email@email.com', '${password}')
    `)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a deposit statement', async () => {
    const email = 'email@email.com'
    const password = 'password'
    const { body } = await request(app).post('/api/v1/sessions').send({
      email,
      password
    })

    const response = await request(app).post('/api/v1/statements/deposit').set({
      Authorization: `Bearer ${body.token}`
    }).send({
      amount: 10,
      description: 'salary'
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.type).toBe('deposit')
    expect(response.body.description).toBe('salary')
    expect(response.body.amount).toEqual(10)
  })

  it('should be able to create a deposit statement', async () => {
    const email = 'email@email.com'
    const password = 'password'
    const { body } = await request(app).post('/api/v1/sessions').send({
      email,
      password
    })

    await request(app).post('/api/v1/statements/deposit').set({
      Authorization: `Bearer ${body.token}`
    }).send({
      amount: 10,
      description: 'salary'
    })

    const response = await request(app).post('/api/v1/statements/withdraw').set({
      Authorization: `Bearer ${body.token}`
    }).send({
      amount: 5,
      description: 'breakfast'
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.type).toBe('withdraw')
    expect(response.body.description).toBe('breakfast')
    expect(response.body.amount).toEqual(5)
  })
})
