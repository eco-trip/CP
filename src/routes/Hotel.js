import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import ContentPanel from '../components/layout/ContentPanel';

const Dashboard = () => {
	const { t } = useTranslation();
	const { id: hotelId } = useParams();
	const navigate = useNavigate();

	return <ContentPanel title={'HotelId: ' + hotelId} back={() => navigate(`/hotels`)} />;
};

export default Dashboard;
