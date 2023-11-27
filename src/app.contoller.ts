// Handlebars templates: register.hbs, login.hbs, chat.hbs

import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';
// Routes
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Render('home')
  homePage() {
    return {};
  }

  @Get('chat')
  @Render('chat')
  @UseGuards(JwtAuthGuard)
  chatPage() {
    return {};
  }
}
