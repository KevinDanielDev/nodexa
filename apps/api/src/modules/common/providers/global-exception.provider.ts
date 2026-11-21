import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../exceptions/global-exception.filter.js';

export const GLOBAL_EXCEPTION_FILTER_PROVIDER = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
};
