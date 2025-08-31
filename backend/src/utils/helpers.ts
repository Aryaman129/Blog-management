import { ApiResponse } from '../types';

export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string,
  meta?: any
): ApiResponse<T> => {
  return {
    success,
    message,
    data,
    error,
    meta,
  };
};

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  meta?: any
): ApiResponse<T> => {
  return createResponse(true, message, data, undefined, meta);
};

export const createErrorResponse = (
  message: string,
  error?: string
): ApiResponse => {
  return createResponse(false, message, undefined, error);
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (!value) return undefined;
  return value.toLowerCase() === 'true';
};

export const parseNumber = (value: string | undefined, defaultValue?: number): number | undefined => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};
