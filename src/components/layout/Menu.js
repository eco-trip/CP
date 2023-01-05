import React, { useContext } from 'react';
import { Menu } from 'antd';

import AppContext from '../../helpers/AppContext';

const CpMenu = () => {
	const { menuItems, setSelectedMenuItem, selectedMenuItem, logged } = useContext(AppContext);

	return (
		<Menu
			mode="inline"
			items={menuItems[logged['custom:role']]}
			selectedKeys={selectedMenuItem}
			onSelect={data => setSelectedMenuItem(data.key)}
		/>
	);
};

export default CpMenu;
