import { Container } from 'unstated';

export type Token = {
  id: string,
  ownerId: string,
  identityId: string,
  tokenHash: string,
  cost: string,
  data: string,
  dataType: string,
  expired: string,
}

export default class TokenStore extends Container {
  state = {
    tokens: new Map()
  }
}
