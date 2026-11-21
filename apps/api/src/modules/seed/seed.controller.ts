import { Controller, Post, Req } from '@nestjs/common';

import { SeedService } from './seed.service.js';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('users')
  public insertUsers(@Req() req: Request): Promise<string> {
    return this.seedService.insertUsers(req);
  }
}
