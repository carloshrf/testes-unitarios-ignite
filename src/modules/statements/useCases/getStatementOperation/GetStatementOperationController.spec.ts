import { hash } from 'bcryptjs'
import request from 'supertest'
import { Connection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

const statementId = uuidV4()

describe('', () => {
  beforeAll(async () => {
    connection = await createConnection
    await connection.runMigrations()

    const userId = uuidV4()
    const password = await hash('password', 8)

    await connection.query(`
      INSERT INTO users(id, name, email, password)
      VALUES ('${userId}', 'supertest', 'email@email.com', '${password}')
    `)

    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type)
      VALUES ('${statementId}', '${userId}', 'super deposit', '10', 'deposit')
    `)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('', async () => {
    const email = 'email@email.com'
    const password = 'password'
    const { body } = await request(app).post('/api/v1/sessions').send({
      email,
      password
    })

    const response = await request(app).get('/api/v1/statements/' + statementId).set({
      Authorization: `Bearer ${body.token}`
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id')
    expect(response.body.description).toBe('super deposit')
    expect(response.body.type).toBe('deposit')
  })
})
