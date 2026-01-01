import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface LogData {
  timestamp: string;
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  headers: Record<string, string>;
  body?: any;
  ip: string;
  userAgent?: string;
  responseTime?: number;
  statusCode?: number;
  responseBody?: any;
}

// Middleware to log requests
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Capture request data
  const requestData: LogData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: req.query,
    headers: {
      'content-type': req.get('content-type') || '',
      'user-agent': req.get('user-agent') || '',
      'authorization': req.get('authorization') ? '***' : '', // Mask sensitive data
    },
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('user-agent'),
  };

  // Log request body (excluding sensitive fields)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '***';
    if (sanitizedBody.token) sanitizedBody.token = '***';
    if (sanitizedBody.authorization) sanitizedBody.authorization = '***';
    requestData.body = sanitizedBody;
  }

  // Log incoming request
  logger.info('Incoming Request', {
    type: 'request',
    ...requestData,
  });

  // Capture original res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const responseTime = Date.now() - startTime;
    
    const responseData: LogData = {
      ...requestData,
      responseTime,
      statusCode: res.statusCode,
    };

    // Log response body (limit size to avoid huge logs)
    if (body) {
      const bodyStr = JSON.stringify(body);
      if (bodyStr.length < 10000) {
        // Only log if response is less than 10KB
        responseData.responseBody = body;
      } else {
        responseData.responseBody = { message: 'Response too large to log' };
      }
    }

    // Log response
    logger.info('Outgoing Response', {
      type: 'response',
      ...responseData,
    });

    return originalJson(body);
  };

  // Handle response finish event as fallback
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    if (!res.headersSent) {
      const responseData: LogData = {
        ...requestData,
        responseTime,
        statusCode: res.statusCode,
      };

      logger.info('Response Finished', {
        type: 'response',
        ...responseData,
      });
    }
  });

  next();
};

