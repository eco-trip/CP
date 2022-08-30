/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeLow, faHotel } from '@fortawesome/pro-solid-svg-icons';
import { Link } from 'react-router-dom';

import useLocalStorage from '../hooks/useLocalStorage';

const AppContext = React.createContext({});

export const AppProvider = props => {
	const { t } = useTranslation();
	const [isMobile, setIsMobile] = useState(false);
	const [logged, setLogged] = useLocalStorage('user', {});
	const [selectedMenuItem, setSelectedMenuItem] = useState(null);

	const menuItems = [
		{
			label: <Link to="/">{t('menu.dashboard')}</Link>,
			key: 'dashboard',
			icon: <FontAwesomeIcon icon={faGaugeLow} />
		},
		{
			label: <Link to="/hotels">{t('menu.hotels')}</Link>,
			key: 'hotels',
			icon: <FontAwesomeIcon icon={faHotel} />
		}
	];

	useLayoutEffect(() => {
		const updateSize = () => {
			setIsMobile(window.innerHeight < 768 || window.innerWidth < 996);
		};

		window.addEventListener('resize', updateSize);
		updateSize();

		return () => window.removeEventListener('resize', updateSize);
	}, []);

	const handleLogout = () => {
		setLogged(null);
		window.location.href = '/';
	};

	return (
		<AppContext.Provider
			value={{
				isMobile,
				logged,
				setLogged,
				handleLogout,
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
