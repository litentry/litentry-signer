import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import TokenCard from '../components/TokenCard';
import fonts from '../../../fonts';
import colors from '../../../colors';
import { createIdentity, useApi, useIdentities } from '../hooks';
import Button from '../../../components/Button';


export default function IdentityList({navigation}) {
		console.disableYellowBox = true;
		const isApiReady = useApi();
		return isApiReady ? <IdentityListView navigation={navigation}/> :
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Waiting for API to be loaded...</Text>
			</View>
}

function IdentityListView(props) {
// this is the actual default endpoint
	const list = useRef(null);
	const identities  = useIdentities('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');

	return <SafeAreaView style={styles.container}>
		<FlatList
			ref={list}
			style={styles.content}
			data={identities}
			keyExtractor={i => i}
			ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
			renderItem={ ({item: identity, index}) =>
					<TokenCard
						identity={identity}
						index={index}
						onPress={() => props.navigation.navigate('TokenList', {identity})}
						style={{ paddingBottom: 10 }}
					/>
			}
			enableEmptySections
		/>
		{/*<Button title={'Generate Identity'} onPress={()=>createIdentity()}/>*/}
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
