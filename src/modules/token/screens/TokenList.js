import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import TokenCard from '../components/TokenCard';
import fonts from '../../../fonts';
import colors from '../../../colors';
import { useTokens } from '../hooks';

export default function TokenList({navigation}) {
// this is the actual default endpoint
	const list = useRef(null);
	const identity = navigation.getParam('identity');
	const tokens  = useTokens(identity);

	return <SafeAreaView style={styles.container}>
		<FlatList
			ref={list}
			style={styles.content}
			data={tokens}
			keyExtractor={i => i}
			ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
			renderItem={ ({item: token, index}) =>
				<TokenCard
					identity={token}
					index={index}
					onPress={() => navigation.navigate('TokenDetails', {token})}
					style={{ paddingBottom: 10 }}
				/>
			}
			enableEmptySections
		/>
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
