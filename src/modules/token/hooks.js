import { ApiPromise, WsProvider } from '@polkadot/api';
import {useEffect, useState} from 'react';

// Construct
const wsProvider = new WsProvider('ws://52.28.235.180:9944/');
const alice = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const testIdentity = '0x53838f9049cd2baa7f81f18962330586ba13d61feb08735f75df4d2bb8518264';
const token = '0xff1238cdb0e9afdac233cc182faafc1349d4b2c142af161993d6a179fc0cc961';
let api;
let isApiReady = false;

export function useApi() {
	const [isApiReady, setApiReady] = useState(false);
	useEffect(()=> {
		async function init () {
			api = await ApiPromise.create({
				provider: wsProvider,
				types: {
					"Address": "AccountId",
					"LookupSource": "AccountId",
					"IdentityOf": {
						"id": "Hash"
					},
					"AuthorizedTokenOf": {
						"id": "Hash",
						"cost": "Balance",
						"data": "u64",
						"datatype": "u64",
						"expired": "u64"
					}
				} });
			setApiReady(true);
			console.log('rpc endpoints are', api.tx.lintentryTemplateModule);
			console.log('api genesisHash', api.genesisHash.toHex());
		}
		init();
	}, []);
	return isApiReady;
}

export function useIdentities(account) {
	const [identities,  setIdentities] = useState([]);
	useEffect(()=> {
		async function queryTokenIdentity() {
			if(account === null || account === '') return;
			const totalNumbers = await api.query.lintentryTemplateModule.ownedIdentitiesCount(account);
			if(totalNumbers.words) {
				const a = new Array(totalNumbers.words[0]).fill(null);
				const promises = a.map((_, i) => {
					return api.query.lintentryTemplateModule.ownedIdentitiesArray([account, i]);
				});
				console.log('promises are', promises);
				let results = await Promise.all(promises);
				const unwrappedResult = results.map(wrappedItem => wrappedItem.toString());
				console.log('result Array is', results, 'call result is', unwrappedResult);
				setIdentities(unwrappedResult);
			}
		}
		queryTokenIdentity();
	}, [account]);
	return identities;
}

export function useTokens(identityId) {
	const [tokens, setTokens] = useState([]);
	useEffect(()=> {
		async function fetchTokens () {
			if(identityId === null || identityId === '') return;
			const totalNumbers = await api.query.lintentryTemplateModule.identityAuthorizedTokensCount(identityId);
			if(totalNumbers.words) {
				const a = new Array(totalNumbers.words[0]).fill(null);
				const promises = a.map((_, i) => {
					return api.query.lintentryTemplateModule.identityAuthorizedTokensArray([identityId, i]);
				});
				console.log('promises are', promises);
				let results = await Promise.all(promises);
				const unwrappedResult = results.map(wrappedItem => wrappedItem.toString());
				console.log('result Array is', results, 'call result is', unwrappedResult);
				setTokens(unwrappedResult);
			}
		}
		fetchTokens();
	}, [identityId]);
	return tokens;
}

export function useTokenOwner (tokenId) {
	const [owner,  setOwner] = useState('');
	useEffect(()=> {
		async function queryTokenIdentity(token) {
			const result = await api.query.lintentryTemplateModule.authorizedTokenIdentity(token);
			console.log('get result', result);
			if(result.toString()!== '') {
				setOwner(result.toString());
			}
		}
		queryTokenIdentity(tokenId)
	}, [tokenId]);
	return owner;
}

export async function getTokenIdentity(token) {
	return await api.query.lintentryTemplateModule.authorizedTokenIdentity(token);
}
