// src/types/express/index.d.ts
import { Grant } from 'keycloak-connect';

declare global {
  namespace Express {
    interface Request {
      kauth?: {
        grant: Grant;
      };
    }
  }
}
