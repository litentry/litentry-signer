import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import TokenCard from '../components/TokenCard';
import fonts from '../../../fonts';
import colors from '../../../colors';
import { mock } from '../../config';
const { ApiPromise, WsProvider } = require('@polkadot/api');


export default class TokenList extends React.Component {
	constructor(){
		super();
		this.state = {
			api:undefined
		}
	}
	componentDidMount(): void {
		console.disableYellowBox = true;
		const provider = new WsProvider('ws://52.28.235.180:9944/');
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
			const totalNumbers = await api.query.litentryModule.ownedAuthorizedTokensCount(mock.mockAccount);

			for( let i = 0; i < totalNumbers; i++) {
				const callResult = await api.query.litentryModule.ownedAuthorizedTokensArray([mock.mockAccount, i]);
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
