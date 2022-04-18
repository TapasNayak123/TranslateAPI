import express from "express";
import bodyParser from 'body-parser';
import AppConfig from './config/AppConfig';
import HttpException from './exceptions/HttpException';
import chalk from 'chalk';
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
import { router } from './routes/routes';
if (app.get('env') === 'development') {
    app.use(
      (
        err: HttpException,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        // console.log(chalk.red(err));
        res.json({
          status: err.status || 500,
          message: err
        })
        next();
      }
    )
  }

  app.use(
    (
      err: HttpException,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // console.log(chalk.red(err.message));
      res.json({
        status: err.status || 500,
        message: err.message
      })
    }
  )
  app.use(router);
  app.listen(AppConfig.PORT)
  // tslint:disable-next-line:no-console
  console.log(
    chalk.bold.green('Server listening on port ') +
    chalk.bold.white.inverse(AppConfig.PORT)
  )
