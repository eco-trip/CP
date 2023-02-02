/* eslint-disable no-nested-ternary */
import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Sticky from 'react-stickynode';

import FullpageLoading from '../components/extra/FullpageLoading';
import ErrorPage from '../components/extra/ErrorPage';
import Header from '../components/layout/Header';
import Menu from '../components/layout/Menu';
import Login from '../components/user/Login';

import AppContext, { AuthStatus } from '../helpers/AppContext';

import Hotels from './Hotels';
import Hotel from './Hotel';

const { Content, Sider } = Layout;

const Index = () => {
	const { authStatus, logged } = useContext(AppContext);
	const [collapsed, setCollapsed] = useState(false);

	if (authStatus === AuthStatus.Loading) return <FullpageLoading />;

	return (
		<BrowserRouter>
			{authStatus === AuthStatus.Loading ? (
				<FullpageLoading />
			) : authStatus === AuthStatus.SignedIn ? (
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
							{logged['custom:role'] === 'hotelier' ? (
								<Route exact path="/" element={<Hotel id={logged['custom:hotelId']} />} />
							) : (
								<>
									<Route exact path="/" element={<Hotels />} />
									<Route exact path="/hotels" element={<Hotels />} />
									<Route exact path="/hotels/:id" element={<Hotel />} />
								</>
							)}
							<Route path="*" element={<ErrorPage status="404" />} />
						</Routes>
					</Content>
				</Layout>
			) : (
				<Layout className="fullpage-layout">
					<Content>
						<Routes>
							<Route path="*" element={<Login />} />
						</Routes>
					</Content>
				</Layout>
			)}
		</BrowserRouter>
	);
};

export default Index;
