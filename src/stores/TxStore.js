// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

// @flow
import { Container } from 'unstated';
import { loadAccountTxs, saveTx } from '../util/db';

type State = {
	signedTxs: Map<string, Object>
};

export default class TxStore extends Container<State> {
	state = {
		signedTxs: new Map()
	};

	async saveTx(tx) {
		await saveTx(tx);
		this.setState({ signedTxs: this.state.signedTxs.set(tx.hash, tx) });
	}

	async loadTxsForAccount(account) {
		const txs = await loadAccountTxs(account);
		this.setState({
			signedTxs: new Map([...this.state.signedTxs, ...txs])
		});
	}

	getTxList({ address }) {
		return Array.from(this.state.signedTxs.values()).filter(
			tx => tx.sender === address || tx.recipient === address
		);
	}
}
