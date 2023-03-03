export class Context {
  userId?: string;
  username?: string;
  name?: string;
  lastName?: string;
  secondLastName?: string;
  email?: string;
  roles?: string[];
  modules?: string[];
  iat?: number;
  exp?: number;

  constructor(payload: any) {
    Object.assign(this, payload);
  }
}
