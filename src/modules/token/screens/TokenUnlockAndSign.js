import React from 'react';
import { Subscribe } from 'unstated';
import AccountsStore from '../../../stores/AccountsStore';
import ScannerStore from '../../../stores/ScannerStore';
import { NavigationActions, StackActions } from "react-navigation";
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Background from '../../../components/Background';
import TextInput from '../../../components/TextInput';
import colors from '../../../colors';
import fonts from '../../../fonts';

export class TokenUnlockAndSign extends React.PureComponent {
	render() {
		const { navigation } = this.props;
		const next = navigation.getParam('next', 'SignedToken');

		return (
			<Subscribe to={[AccountsStore, ScannerStore]}>
				{(accounts, scannerStore) => (
					<AccountUnlockView
						{...this.props}
						accounts={accounts}
						checkPin={async pin => {
							try {
								await scannerStore.signData(pin);
								return true;
							} catch (e) {
								return false;
							}
						}}
						navigate={() => {
							const resetAction = StackActions.reset({
								index: 1,
								key: undefined, // FIXME workaround for now, use SwitchNavigator later: https://github.com/react-navigation/react-navigation/issues/1127#issuecomment-295841343
								actions: [
									NavigationActions.navigate({ routeName: 'AccountList' }),
									NavigationActions.navigate({ routeName: next })
								]
							});
							navigation.dispatch(resetAction);
						}}
					/>
				)}
			</Subscribe>
		);
	}
}

export class AccountUnlock extends React.Component {
	render() {
		const { navigation } = this.props;
		const next = navigation.getParam('next', 'AccountList');

		return (
			<Subscribe to={[AccountsStore]}>
				{accounts => (
					<AccountUnlockView
						{...this.props}
						checkPin={async pin => {
							return await accounts.unlockAccount(accounts.getSelected(), pin);
						}}
						navigate={() => {
							if (next === 'AccountDelete') {
								navigation.goBack();
								navigation.state.params.onDelete();
							} else {
								const resetAction = StackActions.reset({
									index: 2,
									key: undefined, // FIXME workaround for now, use SwitchNavigator later: https://github.com/react-navigation/react-navigation/issues/1127#issuecomment-295841343
									actions: [
										NavigationActions.navigate({ routeName: 'AccountList' }),
										NavigationActions.navigate({ routeName: 'AccountDetails' }),
										NavigationActions.navigate({ routeName: next })
									]
								});
								this.props.navigation.dispatch(resetAction);
							}
						}}
					/>
				)}
			</Subscribe>
		);
	}
}

class AccountUnlockView extends React.PureComponent {
	static propTypes = {
		checkPin: PropTypes.func.isRequired,
		hasWrongPin: PropTypes.bool
	};

	state = {
		pin: '',
		hasWrongPin: false
	};

	showErrorMessage = () => {
		return this.state.hasWrongPin ? 'Wrong pin, please try again' : '';
	};

	render() {
		const { checkPin, navigate } = this.props;

		return (
			<View style={styles.body}>
				<Background />
				<Text style={styles.titleTop}>UNLOCK ACCOUNT</Text>
				<Text style={styles.errorText}>{this.showErrorMessage()}</Text>
				<Text style={styles.title}>PIN</Text>
				<PinInput
					onChangeText={async pin => {
						this.setState({ pin: pin });
						if (pin.length < 4) {
							return;
						}
						if (await checkPin(pin)) {
							navigate();
						} else if (pin.length > 5) {
							this.setState({ hasWrongPin: true });
						}
					}}
					value={this.state.pin}
				/>
			</View>
		);
	}
}

function PinInput(props) {
	return (
		<TextInput
			autoFocus
			keyboardAppearance="dark"
			clearTextOnFocus
			editable
			fontSize={24}
			keyboardType="numeric"
			multiline={false}
			autoCorrect={false}
			numberOfLines={1}
			returnKeyType="next"
			secureTextEntry
			style={styles.pinInput}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.bg,
		padding: 20,
		flex: 1,
		overflow: 'hidden'
	},
	title: {
		fontFamily: fonts.bold,
		color: colors.bg_text_sec,
		fontSize: 18,
		paddingBottom: 10
	},
	titleTop: {
		color: colors.bg_text_sec,
		fontSize: 24,
		fontFamily: fonts.bold,
		paddingBottom: 20,
		textAlign: 'center'
	},
	errorText: {
		fontFamily: fonts.bold,
		textAlign: 'center',
		color: colors.bg_alert,
		fontSize: 12,
		paddingBottom: 20
	},
	pinInput: {
		marginBottom: 20
	}
});
