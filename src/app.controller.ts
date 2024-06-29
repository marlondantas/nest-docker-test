import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcomePage(@Res() res: Response) {
    res.send(`
            <!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Boas Vindas</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .welcome-container {
                        text-align: center;
                        border: 2px solid #0056b3;
                        padding: 40px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        background-color: white;
                        border-radius: 10px;
                    }
                    h1 {
                        color: #0056b3;
                    }
                    p {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="welcome-container">
                    <h1>Seja Bem-Vindo!</h1>
                    <p>Estamos felizes em tê-lo aqui. Explore nossa aplicação e descubra todas as funcionalidades disponíveis!</p>
                </div>
            </body>
            </html>
        `);
  }

  @Get('aloha')
  getHello(): string {
    return this.appService.getHello();
  }
}
