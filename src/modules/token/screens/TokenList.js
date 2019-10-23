import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import Button from '../../../components/Button';
import set from '@babel/runtime/helpers/esm/set';
import AccountCard from '../../../components/AccountCard';
import TokenCard from '../components/TokenCard';
import fonts from '../../../fonts';
import colors from '../../../colors';
const { ApiPromise, WsProvider } = require('@polkadot/api');

const mockAccount = '5Evyk5JtBixLd4YJVJ1p2bvwHcUiU6sz2obt1AoNHQanSXVW'
const mockIdentity = '0xf7b20801ad0e0ff5364d0b1446727c2a893ad43cecb212f8f8c5d6af6cc9089f'
const mockTokens = [];

export default class TokenList extends React.Component {
	constructor(){
		super();
		this.state = {
			api:undefined
		}
	}
	componentDidMount(): void {
		console.disableYellowBox = true;
		const provider = new WsProvider('ws://112.125.25.18:9944/');
		ApiPromise.create({ provider }).then(createdApi=>{
			global.api = createdApi;
			this.setState({api:createdApi});
			console.log('API is ready')
		}).catch(e=> console.log('api creating error is', e));
	}

	render() {
		const { api } = this.state;
		return api ? <TokenListView navigation={this.props.navigation}/> :
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Waiting for API to be loaded...</Text>
			</View>
	}
}

function TokenListView(props) {
// this is the actual default endpoint
	const [tokenList, setTokenList] = useState([]);
	const list = useRef(null);
	const {api} = global;


	function scrollToIndex() {
		const { navigation } = props;
		const id = navigation.getParam('accountId');
		const index = id || -1;
		if (list && typeof index === 'number' && index !== -1) {
			navigation.setParams({ index: undefined });
			list.scrollToIndex({ index });
		}
	}

	useEffect(() => {
		const fetchTokens = async () => {
			const tokensArray = [];
			await api.isReady;
			const totalNumbers = await api.query.litentryModule.ownedAuthorizedTokensCount(mockAccount);

			for( let i = 0; i < totalNumbers; i++) {
				const callResult = await api.query.litentryModule.ownedAuthorizedTokensArray([mockAccount, i]);
				tokensArray.push({
					id: i,
					hash: callResult.toHex()
				});
				console.log('result Array is', tokensArray);
			}
			setTokenList(tokensArray);
			// scrollToIndex();
		};
		// Update the document title using the browser API
		fetchTokens();
	},[]);

	const testFunction = async () => {
		try {



			// const version = await provider.send('client_version', []);
		}catch (e) {
			console.log('error is', e);
		}
	};

	return <SafeAreaView style={styles.container}>
		<FlatList
			ref={list}
			style={styles.content}
			data={tokenList}
			keyExtractor={token => token.id.toString()}
			ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
			renderItem={ ({item}) =>
					<TokenCard
						token={item}
						onPress={address => props.navigation.navigate('TokenDetails', {token: item})}
						style={{ paddingBottom: 10 }}
					/>
			}
			enableEmptySections
		/>

		{/*<Button title={'send test request'} onPress={testFunction}/>*/}
	</SafeAreaView>;
}

const styles  = {
	container: {
		flex: 1,
		flexDirection: 'column',
		padding: 20,
	},
	content: {
		flex:1,
	},
	loadingContainer: {
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontFamily: fonts.bold,
		color: colors.bg_text_sec,
		fontSize: 34,
	}
};
