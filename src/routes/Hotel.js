import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import ContentPanel from '../components/layout/ContentPanel';

import Api from '../helpers/Api';

const Dashboard = () => {
	const { t } = useTranslation();
	const { id: hotelId } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [hotel, setHotel] = useState();

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

	return <ContentPanel title={hotel ? hotel.name : ''} back={() => navigate(`/hotels`)} loading={loading} />;
};

export default Dashboard;
