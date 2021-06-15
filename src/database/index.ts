require('dotenv').config()
import { createConnection, getConnectionOptions } from 'typeorm';

export default (async () => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: 'localhost',
      database: process.env.NOD_ENV === 'test' ? 'fin_api_test' : 'fin_api'
    })
  )
})()
