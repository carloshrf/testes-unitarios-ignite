import { Connection } from "typeorm"
import request from 'supertest'
import { app } from '../../../../app'
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid"
import { hash } from "bcryptjs"

let connection: Connection

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection
    await connection.runMigrations();

    const id = uuidV4()
    const password = await hash('password', 8)

    await connection.query(`
      INSERT INTO users(id, name, email, password)
        VALUES ('${id}', 'user', 'email@email.com', '${password}')
    `)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to show the user profile', async () => {
    const email = 'email@email.com'

    const tokenResponse = await request(app).post('/api/v1/sessions').send({
      email,
      password: 'password'
    })

    const { token } = tokenResponse.body;

    const profileResponse = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    })

    expect(profileResponse.body).toHaveProperty('id')
    expect(profileResponse.body.email).toBe(email)
  })
})
