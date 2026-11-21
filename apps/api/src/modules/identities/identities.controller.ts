import { Controller, Post, Body, Delete } from '@nestjs/common';

import { IdentitiesService } from './identities.service.js';

import { LinkIdentityDto } from './dto/link-identity.dto.js';
import { UnlinkIdentityDto } from './dto/unlink-identity.dto.js';

@Controller('identities')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @Post('link')
  public linkIdentity(@Body() linkIdentityDto: LinkIdentityDto) {
    return this.identitiesService.linkIdentity(linkIdentityDto);
  }

  @Delete('unlink')
  public unlinkIdentity(@Body() unlinkIdentityDto: UnlinkIdentityDto) {
    return this.identitiesService.unlinkIdentity(unlinkIdentityDto);
  }
}
