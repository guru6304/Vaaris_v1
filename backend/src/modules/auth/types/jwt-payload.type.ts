export interface JwtPayload {
  sub: string;       // User ID
  email: string;     // User email
  type: 'access' | 'refresh';
}
