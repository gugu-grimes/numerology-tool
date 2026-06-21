import { ExceptionFilter, Catch, HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

// ADR-003: RFC7807 application/problem+json error format
@Catch()
export class Rfc7807ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let type = 'https://bazi.app/errors/internal-server-error';
    let title = '内部服务器错误';
    let detail = '请求处理过程中发生未知错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        // If already in RFC7807 format, pass through
        if (resp.type && resp.title) {
          response.status(status).json(resp);
          return;
        }
        // Convert class-validator errors
        if (resp.message) {
          detail = Array.isArray(resp.message)
            ? (resp.message as string[]).join('; ')
            : String(resp.message);
        }
      }

      // Map common status codes to RFC7807 types
      switch (status) {
        case 400:
          type = 'https://bazi.app/errors/invalid-input';
          title = '输入校验失败';
          break;
        case 404:
          type = 'https://bazi.app/errors/not-found';
          title = '资源不存在';
          break;
        case 422:
          type = 'https://bazi.app/errors/validation-error';
          title = '业务规则校验失败';
          break;
      }
    }

    response.status(status).json({
      type,
      title,
      status,
      detail,
    });
  }
}