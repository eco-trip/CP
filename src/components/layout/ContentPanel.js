/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Typography, Button, Skeleton, Row, Col, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons';
import Sticky from 'react-stickynode';

const { Title } = Typography;

const ContentPanel = ({
	children,
	title,
	subtitle = false,
	back = false,
	borderless = false,
	withTabs = false,
	loading = false
}) => {
	const titleContainer =
		title || subtitle ? (
			<div id="title-container">
				{title && <Title>{title}</Title>}
				{subtitle && <div className="subtitle">{subtitle}</div>}
			</div>
		) : (
			''
		);

	const titleSkeleton = (
		<div id="title-container">
			<Skeleton title paragraph={false} active />
		</div>
	);

	const titleBox = (
		<div id="title-box">
			{back && (
				<div className="title-back">
					<Button onClick={back} type="link">
						<FontAwesomeIcon icon={faAngleLeft} />
					</Button>
				</div>
			)}
			{loading ? titleSkeleton : titleContainer}
		</div>
	);

	return (
		<div className="content-panel">
			{title || back || subtitle ? titleBox : ''}
			{withTabs ? (
				<div className={'content-tabs' + (back ? ' with-back' : '')}>{children}</div>
			) : (
				<div className={'content-children' + (borderless ? ' borderless' : '')}>
					{loading ? <ContentLoading /> : children}
				</div>
			)}
		</div>
	);
};

export default ContentPanel;

export const renderTabBar = (props, DefaultTabBar) => {
	let top = 2;
	if (document.querySelector('#title-box')) top += document.querySelector('#title-box').clientHeight;
	if (document.querySelector('#topbar')) top += document.querySelector('#topbar').clientHeight;

	return (
		<Sticky top={top} className="ant-tabs ant-tabs-top">
			{() => <DefaultTabBar {...props} />}
		</Sticky>
	);
};

export const ContentLoading = () => (
	<div className="content-loading">
		<Row type="flex" justify="center" align="middle">
			<Col>
				<Spin />
			</Col>
		</Row>
	</div>
);
