import { Connection } from 'typeorm'
import request from 'supertest'
import createConnection from '../../../../database'
import { app } from '../../../../app'
import { v4 as uuidV4 } from 'uuid'
import { hash } from 'bcryptjs'

let connection: Connection

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection
    await connection.runMigrations()

    const id = uuidV4()
    const password = await hash('password', 8)

    await connection.query(`
      INSERT INTO users(id, name, email, password)
      VALUES ('${id}', 'supertest', 'email@email.com', '${password}')
    `)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate an user', async () => {
    const email = 'email@email.com'
    const password = 'password'

    const response = await request(app).post('/api/v1/sessions').send({
      email,
      password
    })

    expect(response.body).toHaveProperty('token')
  })
})
