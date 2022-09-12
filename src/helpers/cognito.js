import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
	UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
	ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

let logged = userPool.getCurrentUser();

export const getCurrentUser = () => logged;

const getCognitoUser = email =>
	new CognitoUser({
		Username: email,
		Pool: userPool
	});

export const getSession = async () => {
	if (!logged) {
		logged = userPool.getCurrentUser();
	}

	return new Promise((resolve, reject) => {
		logged.getSession((err, session) => {
			if (err) {
				reject(err);
			} else {
				resolve(session);
			}
		});
	}).catch(err => {
		throw err;
	});
};

export const signIn = async (email, password) =>
	new Promise((resolve, reject) => {
		const authenticationData = {
			Username: email,
			Password: password
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData);

		logged = getCognitoUser(email);

		logged.authenticateUser(authenticationDetails, {
			onSuccess: res => resolve(res),
			onFailure: err => reject(err)
		});
	}).catch(err => {
		throw err;
	});

export const signOut = () => {
	if (logged) {
		logged.signOut();
	}
};

export const getAttributes = async () =>
	new Promise((resolve, reject) => {
		logged.getUserAttributes((err, attributes) => {
			if (err) {
				reject(err);
			} else {
				resolve(attributes);
			}
		});
	}).catch(err => {
		throw err;
	});

export const refreshToken = async token =>
	new Promise((resolve, reject) => {
		logged.refreshSession(token, (err, session) => {
			if (err) {
				reject(err);
			} else {
				resolve(session);
			}
		});
	}).catch(err => {
		throw err;
	});
