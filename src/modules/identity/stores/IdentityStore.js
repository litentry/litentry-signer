import { Container } from 'unstated';

export type Identity = {
	id: string,
	ownerId: string,
	identityHash: string
};

export default class IdentityStore extends Container {
	state = {
		tokens: new Map()
	};
}
