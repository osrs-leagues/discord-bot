import { Environment } from '../config';

export type Job = {
  interval: { [key in Environment]: string | undefined };
  runOnStart: boolean;
  execute: () => void;
};
