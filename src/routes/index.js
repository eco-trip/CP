import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Sticky from 'react-stickynode';

import ErrorPage from '../components/extra/ErrorPage';
import Header from '../components/layout/Header';
import Menu from '../components/layout/Menu';
import Login from '../components/user/Login';
import ChangePassword from '../components/user/ChangePassword';

import AppContext from '../helpers/AppContext';

import Dashboard from './Dashboard';
import Hotels from './Hotels';

const { Content, Sider } = Layout;

const Index = () => {
	const { logged } = useContext(AppContext);
	const [collapsed, setCollapsed] = useState(false);

	return (
		<BrowserRouter>
			{logged ? (
				<Layout className="main-layout">
					<Header />
					<Sider
						breakpoint="lg"
						theme="light"
						collapsible
						collapsed={collapsed}
						onCollapse={value => setCollapsed(value)}
						className="main-sider"
					>
						<Sticky top="#topbar">
							<Menu />
						</Sticky>
					</Sider>
					<Content>
						<Routes>
							<Route exact path="/" element={<Dashboard />} />
							<Route exact path="/hotels" element={<Hotels />} />
							<Route path="*" element={<ErrorPage status="404" />} />
						</Routes>
					</Content>
				</Layout>
			) : (
				<Layout className="fullpage-layout">
					<Content>
						<Routes>
							<Route exact path="/changePassword/:id/:token" element={<ChangePassword />} />
							<Route path="*" element={<Login />} />
						</Routes>
					</Content>
				</Layout>
			)}
		</BrowserRouter>
	);
};

export default Index;
