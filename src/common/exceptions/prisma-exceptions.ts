import { HttpStatus } from '@nestjs/common';
import type { PrismaErrorCodeMappings } from '@/types/prisma/client';

const {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED,
  SERVICE_UNAVAILABLE,
} = HttpStatus;

/**
 * [Prisma Error Code](https://www.prisma.io/docs/reference/api-reference/error-reference#common): HTTP Status ResponseCode: HTTP Status Response
 */
export const PrismaErrorCodeMappping: PrismaErrorCodeMappings = {
  P2000: BAD_REQUEST,
  // P2001: NOT_FOUND,
  P2002: CONFLICT,
  P2003: BAD_REQUEST,
  P2004: INTERNAL_SERVER_ERROR,
  P2005: BAD_REQUEST,
  P2006: BAD_REQUEST,
  P2007: BAD_REQUEST,
  P2008: BAD_REQUEST,
  P2009: BAD_REQUEST,
  P2010: INTERNAL_SERVER_ERROR,
  P2011: BAD_REQUEST,
  P2012: BAD_REQUEST,
  P2013: BAD_REQUEST,
  P2014: BAD_REQUEST,
  // P2015: NOT_FOUND,
  P2016: BAD_REQUEST,
  P2017: BAD_REQUEST,
  P2018: BAD_REQUEST,
  P2019: BAD_REQUEST,
  P2020: BAD_REQUEST,
  P2021: INTERNAL_SERVER_ERROR,
  P2022: INTERNAL_SERVER_ERROR,
  P2023: INTERNAL_SERVER_ERROR,
  P2024: SERVICE_UNAVAILABLE,
  P2025: BAD_REQUEST,
  P2026: NOT_IMPLEMENTED,
  P2027: INTERNAL_SERVER_ERROR,
  P2028: INTERNAL_SERVER_ERROR,
  P2030: BAD_REQUEST,
  P2031: INTERNAL_SERVER_ERROR,
  P2033: BAD_REQUEST,
  P2034: CONFLICT,
};
