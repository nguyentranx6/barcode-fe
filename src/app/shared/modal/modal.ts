export interface User {
  token: string,

  user: {
    _id: string,
    email: string,
    name: string
  }
}
