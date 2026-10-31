import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  public getHealthStatus(): {
    message: string;
    status: string;
    timestamp: string;
  } {
    return {
      message: 'API is healthy',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
