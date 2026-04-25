import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMySubscriptions(@Req() req: any) {
    return this.subscriptionsService.getUserSubscriptions(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createSubscription(@Body() body: any, @Req() req: any) {
    return this.subscriptionsService.createSubscription(body, req.user.sub);
  }
}