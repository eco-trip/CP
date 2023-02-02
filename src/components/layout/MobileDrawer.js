/* eslint-disable max-len */
import React, { useContext } from 'react';
import { Drawer, Button, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/pro-solid-svg-icons';

import AppContext from '../../helpers/AppContext';
import UserInfo from '../user/UserInfo';
import LanguageSelector from '../controls/LanguageSelector';
import Menu from './Menu';

const MobileDrawer = props => {
	const { show, close } = props;
	const { logged, signOut } = useContext(AppContext);

	return (
		<Drawer
			className="mobile-drawer"
			title={
				<div className="mobile-logged">
					<UserInfo user={logged} />
				</div>
			}
			placement="left"
			width="90vw"
			onClose={() => close()}
			open={show}
		>
			<div className="mobile-drawer-inner">
				<div className="mobile-menu">
					<Menu />
				</div>
				<div className="mobile-bottom">
					<Row>
						<Col flex="none">
							<LanguageSelector />
						</Col>
						<Col flex="auto" className="align-right">
							<Button type="primary" shape="circle" icon={<FontAwesomeIcon icon={faPowerOff} />} onClick={signOut} />
						</Col>
					</Row>
				</div>
			</div>
		</Drawer>
	);
};

export default React.memo(MobileDrawer);
