import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createErrorResponse } from '../utils/helpers';

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  console.log('=== VALIDATION DEBUG ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Validation errors:', errors.array());
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    console.log('Validation failed with messages:', errorMessages);
    return res.status(400).json(createErrorResponse('Validation failed', errorMessages));
  }
  
  console.log('Validation passed');
  next();
};

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  // Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json(createErrorResponse('Duplicate entry. This record already exists.'));
  }

  if (error.code === 'P2025') {
    return res.status(404).json(createErrorResponse('Record not found'));
  }

  // Default error
  const message = error.message || 'Internal server error';
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json(createErrorResponse(message));
};
