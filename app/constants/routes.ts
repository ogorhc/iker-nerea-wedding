/**
 * Application route constants
 * Use these constants instead of string literals to avoid typos and ensure consistency
 */
export const ROUTES = {
  HOME: '/',
  MEDIA: '/media',
  RSVP: '/rsvp',
} as const;

/**
 * Type for route values
 */
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
