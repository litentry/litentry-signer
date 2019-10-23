import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import QrView from '../../../components/QrView';
import colors from '../../../colors';

TokenDetails.navigationOptions = {
	title: 'Token Details'
};

export default function TokenDetails({navigation}) {

	const token = navigation.getParam('token');

	return token.hash ? <View style={styles.body}>
		<Text>Token QR Code</Text>
		<View style={styles.qr}>
			<QrView data={token.hash} />
		</View>
	</View>: <Text> No hash specified</Text>
}

const styles = {
	body: {
		backgroundColor: colors.bg,
		flex: 1,
		flexDirection: 'column',
		padding: 20
	},
	qr: {
		marginTop: 20,
		backgroundColor: colors.card_bg
	},
}
