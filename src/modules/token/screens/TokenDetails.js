import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import QrView from '../../../components/QrView';
import Button from '../../../components/Button';
import colors from '../../../colors';
import { hexStripPrefix, isU8a, u8aToHex } from '@polkadot/util';
import { isAscii } from '../../../util/message';
import { asciiToHex } from '../../../util/decoders';
import { substrateSign } from '../../../util/native';
import { mock } from '../../config';
import { getTokenIdentity } from '../hooks';

TokenDetails.navigationOptions = {
	title: 'Token Details'
};

export default function TokenDetails({navigation}) {

	const token = navigation.getParam('token');

	const [qrData, setQrData] = useState('');
	const [identity, setIdentity] = useState('');

	useEffect(()=> {
		const getIdentity = async () => {
			const identity = await getTokenIdentity(token);
			setIdentity(identity.toString());
		};
		getIdentity();
	}, [identity]);

	const generateSignedDetails = async () => {
		let signable;
		const dataToSign = `${mock.mockAccount}:${token.hash}:${Date.now()}`;
		if (isU8a(dataToSign)) {
			signable = hexStripPrefix(u8aToHex(dataToSign));
		} else if (isAscii(dataToSign)) {
			signable = hexStripPrefix(asciiToHex(dataToSign));
		}
		const signedData = await substrateSign(mock.mockWrongSeed, signable);
		setQrData(`${dataToSign}:${signedData}`);
	};

	const generateMockSigning = () => {
		setQrData(token);
	};

	const showIdentityQR = () => {
		setQrData(identity)
	};

	return token ? <ScrollView style={styles.body}>
		<Text style={styles.text}>Token QR Code</Text>
		<Text style={styles.text}>{`Token Hash: ${token}`}</Text>
		{identity !== '' && <Text style={styles.text}>{`Token Belongs to Identity: ${identity}`}</Text>}
		{qrData !== '' && <View style={styles.qr}>
			<QrView data={qrData} />
		</View>}
		<Button title="Generate Signed Token" buttonStyles={styles.qrButton} onPress={generateMockSigning}/>
		<Button title="Show Identity QR" buttonStyles={styles.qrButton} onPress={showIdentityQR}/>
	</ScrollView>: <Text> No hash specified</Text>
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
	text: {
		color: colors.bg_text,
	},
	qrButton: {
		marginTop: 5,
	}
};
