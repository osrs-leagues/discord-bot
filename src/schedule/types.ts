import { Environment } from '../config';

export type Job = {
  interval: { [key in Environment]: string | undefined };
  schedule: () => void;
};
