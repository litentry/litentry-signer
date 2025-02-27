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

'use strict';

import { fromWei } from './units';

describe('units', () => {
	it('should properly convert units from wei', () => {
		let wei = '5208';
		let ether = fromWei(wei);
		expect(ether).toEqual('0.000000000000021');
	});

	it('should return BigNumber for undefined values', () => {
		expect(fromWei(null)).toEqual('0');
		expect(fromWei(undefined)).toEqual('0');
		expect(fromWei(0)).toEqual('0');
		expect(fromWei('0')).toEqual('0');
		expect(fromWei('')).toEqual('0');
	});
});
