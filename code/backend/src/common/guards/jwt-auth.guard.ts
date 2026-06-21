import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// ADR-006: Unified NestJS Guard for authentication.
// Currently all endpoints are public (no authentication required per code-structure.md).
// JWT Guard will be activated when authentication is implemented.

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // All endpoints are currently public — no authentication required
    return true;
  }
}

@Injectable()
export class PublicDecorator {
  // Marker decorator for explicitly public endpoints
  // Will be used when JWT auth is activated
}