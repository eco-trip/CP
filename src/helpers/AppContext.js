/* eslint-disable no-useless-catch */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/pro-solid-svg-icons';
import { Link } from 'react-router-dom';

import * as cognito from './cognito';

const AppContext = React.createContext({});

export const AuthStatus = {
	Loading: 0,
	SignedIn: 1,
	SignedOut: -1
};

export const AppProvider = props => {
	const { t } = useTranslation();
	const [isMobile, setIsMobile] = useState(false);
	const [selectedMenuItem, setSelectedMenuItem] = useState(null);

	const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
	const [sessionInfo, setSessionInfo] = useState({});
	const [logged, setLogged] = useState({});

	const menuItems = {
		admin: [
			{
				label: <Link to="/hotels">{t('menu.hotels')}</Link>,
				key: 'hotels',
				icon: <FontAwesomeIcon icon={faHotel} />
			}
		],
		hotelier: [
			{
				label: <Link to="/">{t('menu.dashboard')}</Link>,
				key: 'hotels',
				icon: <FontAwesomeIcon icon={faHotel} />
			}
		]
	};

	const getSessionInfo = async () => {
		try {
			const session = await cognito.getSession();
			setSessionInfo({
				accessToken: session.accessToken.jwtToken,
				refreshToken: session.refreshToken
			});

			const attr = await cognito.getAttributes();
			const parsed = attr.reduce((obj, item) => {
				// eslint-disable-next-line no-param-reassign
				obj[item.getName()] = item.getValue();
				return obj;
			}, {});
			setLogged(parsed);
			setAuthStatus(AuthStatus.SignedIn);
		} catch (err) {
			setAuthStatus(AuthStatus.SignedOut);
			setSessionInfo({});
			setLogged({});
		}
	};

	useEffect(() => {
		getSessionInfo();
	}, []);

	const signIn = async (username, password) => {
		try {
			await cognito.signIn(username, password);
			await getSessionInfo();
			setAuthStatus(AuthStatus.SignedIn);
		} catch (err) {
			setAuthStatus(AuthStatus.SignedOut);
			throw err;
		}
	};

	const signOut = () => {
		cognito.signOut();
		setAuthStatus(AuthStatus.SignedOut);
		setSessionInfo({});
		setLogged({});
	};

	const refreshToken = async token => {
		try {
			const session = await cognito.refreshToken(token);
			setSessionInfo({
				accessToken: session.accessToken.jwtToken,
				refreshToken: session.refreshToken
			});
		} catch (err) {
			throw err;
		}
	};

	useLayoutEffect(() => {
		const updateSize = () => {
			setIsMobile(window.innerHeight < 768 || window.innerWidth < 996);
		};

		window.addEventListener('resize', updateSize);
		updateSize();

		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return (
		<AppContext.Provider
			value={{
				isMobile,
				authStatus,
				sessionInfo,
				logged,
				signIn,
				signOut,
				refreshToken,
				menuItems,
				setSelectedMenuItem,
				selectedMenuItem
			}}
		>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContext;
