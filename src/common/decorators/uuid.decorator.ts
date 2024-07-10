// src/common/decorators/get-user-uuid.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetUserUuid = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    const token: string = req.headers.authorization?.split(' ')[1]
      ? req.headers.authorization?.split(' ')[1]
      : '';

    const decoded = jwt.decode(token);

    // Verifica se o decoded é um objeto e contém a propriedade sub
    if (typeof decoded === 'object' && decoded && 'sub' in decoded) {
      return decoded.sub ? decoded.sub : ''; // Asegurando que o tipo retornado é string
    } else {
      throw new Error('Invalid token or sub property not found');
    }
  },
);
