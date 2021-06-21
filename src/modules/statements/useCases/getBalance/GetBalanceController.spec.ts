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

    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type)
      VALUES ('${uuidV4()}', '${userId}', 'super deposit', '10', 'deposit')
    `)

    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type)
      VALUES ('${uuidV4()}', '${userId}', 'test withdraw', '8', 'withdraw')
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

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${body.token}`
    })

    expect(response.status).toBe(200)
    expect(response.body.statement.length).toEqual(2)
    expect(response.body.balance).toEqual(2)
  })
})
