// Copyright 2015-2017 Parity Technologies (UK) Ltd.
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

"use strict";

import SecureStorage from "react-native-secure-storage";
import { AsyncStorage } from "react-native";

const accountsStore = {
  keychainService: "accounts",
  sharedPreferencesName: "accounts"
};

const txStore = {
  keychainService: "transactions",
  sharedPreferencesName: "transactions"
};

function accountTxsKey(address) {
  return "account_txs_" + address;
}

function txKey(hash) {
  return "tx_" + hash;
}

export const deleteAccount = account =>
  SecureStorage.deleteItem(account.address, accountsStore);

export const saveAccount = account =>
  SecureStorage.setItem(
    account.address.toLowerCase(),
    JSON.stringify(account, null, 0),
    accountsStore
  );

export const saveAccounts = accounts => accounts.forEach(saveAccount);

export const loadAccounts = () => {
  if (!SecureStorage) {
    return Promise.resolve([]);
  }

  return SecureStorage.getAllItems(accountsStore).then(accounts =>
    Object.values(accounts).map(account => JSON.parse(account))
  );
};

export async function saveTx(tx) {
  if (!tx.sender || tx.sender.length === 0) {
    throw new Error("Tx should contain sender to save");
  }
  if (!tx.recipient || tx.recipient.length === 0) {
    throw new Error("Tx should contain receiver to save");
  }
  await [
    storagePushValue(accountTxsKey(tx.sender), tx.hash),
    storagePushValue(accountTxsKey(tx.recipient), tx.hash),
    AsyncStorage.setItem(txKey(tx.hash), JSON.stringify(tx))
  ];
}

export async function loadAccountTxHashes(address) {
  const result = await AsyncStorage.getItem(accountTxsKey(address));
  return result ? JSON.parse(result) : [];
}

export async function loadAccountTxs(address) {
  const hashes = await loadAccountTxHashes(address);
  return (await AsyncStorage.multiGet(hashes.map(txKey))).map(v => [
    v[0],
    JSON.parse(v[1])
  ]);
}

async function storagePushValue(key, value) {
  let currentVal = await AsyncStorage.getItem(key);
  if (currentVal === null) {
    return AsyncStorage.setItem(key, JSON.stringify([value]));
  } else {
    currentVal = JSON.parse(currentVal);
    const newVal = new Set([...currentVal, value]);
    return AsyncStorage.setItem(key, JSON.stringify(Array.from(newVal)));
  }
}
