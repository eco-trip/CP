/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Row, Col, Space, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faBars } from '@fortawesome/pro-solid-svg-icons';

import AppContext from '../../helpers/AppContext';
import LanguageSelector from '../controls/LanguageSelector';
import UserInfo from '../user/UserInfo';

import logo from '../../img/logo.png';

import MobileDrawer from './MobileDrawer';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t } = useTranslation();
	const { logged, signOut, isMobile } = useContext(AppContext);
	const [showMobileDrawer, setShowMobileDrawer] = useState(false);

	const buttons = () => (
		<Space>
			<UserInfo user={logged} />
			<Tooltip title={t('login.logout')} placement="bottom">
				<Button type="primary" shape="circle" icon={<FontAwesomeIcon icon={faPowerOff} />} onClick={signOut} />
			</Tooltip>
			<LanguageSelector />
		</Space>
	);

	return (
		<>
			<Header id="topbar">
				<Row className="gutter-row" align="middle">
					{isMobile ? (
						<>
							<Col flex="none">
								<Link to="/">
									<img src={logo} alt="DesignSpec" id="logo" />
								</Link>
							</Col>
							<Col flex="auto">
								<Space style={{ justifyContent: 'end' }}>
									{logged ? <UserInfo user={logged} mobile /> : {}}
									<Button
										type="primary"
										shape="circle"
										icon={<FontAwesomeIcon icon={faBars} />}
										onClick={() => setShowMobileDrawer(true)}
									/>
								</Space>
							</Col>
						</>
					) : (
						<>
							<Col flex="none">
								<Link to="/">
									<img src={logo} alt="DesignSpec" id="logo" />
								</Link>
							</Col>
							<Col flex="auto" />
							<Col flex="none">
								<Space size={16}>{buttons()}</Space>
							</Col>
						</>
					)}
				</Row>
			</Header>
			{isMobile && <MobileDrawer show={showMobileDrawer} close={() => setShowMobileDrawer(false)} />}
		</>
	);
};

export default React.memo(HeaderComponent);
