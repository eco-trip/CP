import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faLayerGroup, faUser } from '@fortawesome/pro-solid-svg-icons';

import ContentPanel, { renderTabBar } from '../components/layout/ContentPanel';
import Api from '../helpers/Api';
import AppContext from '../helpers/AppContext';

import HotelDetails from './HotelDetails';
import HotelUser from './HotelUser';
import HotelRooms from './HotelRooms';

const TabKeys = {
	Detail: '0',
	User: '1',
	Rooms: '2'
};

const Hotel = ({ id }) => {
	const { t } = useTranslation();
	const { logged } = useContext(AppContext);
	const { id: paramsId } = useParams();
	const location = useLocation();
	const { hash: fragment } = useLocation();
	const navigate = useNavigate();

	const hotelId = paramsId || id;

	const [selectedTab, setSelectedTab] = useState(null);

	const [loading, setLoading] = useState(true);
	const [hotel, setHotel] = useState();

	useEffect(() => {
		setSelectedTab(fragment.replace('#', '') || TabKeys.General);
	}, [fragment]);

	const getHotel = () =>
		Api.get(`/hotels/${hotelId}`)
			.then(res => {
				setLoading(false);
				setHotel(res.data);
			})
			.catch(err => err.globalHandler && err.globalHandler());

	useEffect(() => {
		getHotel();
		setLoading(true);
	}, [hotelId]);

	const items = [
		{
			key: TabKeys.Detail,
			label: (
				<span>
					<FontAwesomeIcon icon={faCircleInfo} />
					{t('hotels.details')}
				</span>
			),
			children: <HotelDetails hotel={hotel} TabKeys={TabKeys} onSave={getHotel} />
		},
		{
			key: TabKeys.User,
			label: (
				<span>
					<FontAwesomeIcon icon={faUser} />
					{t('hotels.user')}
				</span>
			),
			children: <HotelUser hotel={hotel} TabKeys={TabKeys} />
		},
		{
			key: TabKeys.Rooms,
			label: (
				<span>
					<FontAwesomeIcon icon={faLayerGroup} />
					{t('hotels.rooms')}
				</span>
			),
			children: <HotelRooms hotel={hotel} TabKeys={TabKeys} />
		}
	];

	const tabs = logged['custom:role'] === 'hotelier' ? items.filter(item => item.key !== '1') : items;

	return (
		<ContentPanel
			title={hotel ? hotel.name : ''}
			back={logged['custom:role'] === 'hotelier' ? false : () => navigate(`/hotels`)}
			loading={loading}
			withTabs
		>
			<Tabs
				defaultActiveKey={TabKeys.General}
				activeKey={selectedTab}
				onTabClick={e => {
					setSelectedTab(e);
					navigate(`${location.pathname}${location.search}#${e}`);
				}}
				renderTabBar={renderTabBar}
				items={tabs}
			/>
		</ContentPanel>
	);
};

export default Hotel;
