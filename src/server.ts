import http from 'http';
import express, { Express } from 'express';
import routes from './routes/zipcodesroutes';

const router: Express = express();

router.use(express.json());
router.use('/', routes);

const httpServer = http.createServer(router);
httpServer.listen(process.env.PORT);
