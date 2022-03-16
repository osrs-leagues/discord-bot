import { Environment } from '../config';

export type Job = {
  enabled: boolean;
  interval: { [key in Environment]: string | undefined };
  runOnStart: boolean;
  execute: () => void;
};
