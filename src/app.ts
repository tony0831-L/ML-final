import express from 'express'
import { router } from "./Routers"
import { logger } from './middlewares/log';
const http = require('http');
import cors from 'cors';
import { MongoDB } from './utils/DB/MongoDB';
require('dotenv').config()

const main = async () => {
  const app: express.Application = express()
  const server = http.createServer(app);

  await MongoDB.init({
    name: process.env.DBUSER as string,
    password: process.env.DBPASSWORD as string,
    host: process.env.DBHOST as string,
    port: process.env.DBPORT as string,
    dbName: process.env.DBNAME as string
  })

  app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200,
    "exposedHeaders": ['Content-Disposition']
  }))

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }))
  app.use('/assets', express.static(process.env.assetsPath as string));

  
  for (const route of router()) {
    app.use(route.getRouter())
  }

  server.listen(process.env.PORT, () => {
    logger.info('listening on *:' + process.env.PORT);
  });

}

main()