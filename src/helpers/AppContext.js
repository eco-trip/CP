/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeLow } from '@fortawesome/pro-solid-svg-icons';
import { Link } from 'react-router-dom';

import useLocalStorage from '../hooks/useLocalStorage';

const AppContext = React.createContext({});

export const AppProvider = props => {
	const [isMobile, setIsMobile] = useState(false);
	const [logged, setLogged] = useLocalStorage('user', {});
	const [selectedMenuItem, setSelectedMenuItem] = useState(null);

	const menuItems = [
		{
			label: <Link to="/">Dashboard</Link>,
			key: 'Dashboard',
			icon: <FontAwesomeIcon icon={faGaugeLow} />
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
