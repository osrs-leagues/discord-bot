import app from './app';
import config from '../config';

export const startApp = () => {
  if (config.environment !== 'test') {
    app.listen(config.port, () => {
      console.log(
        `Running League-Discord API on port ${config.port} in ${config.environment}.`,
      );
    });
  }
};
