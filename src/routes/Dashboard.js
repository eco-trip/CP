import React from 'react';
import { useTranslation } from 'react-i18next';

import ContentPanel from '../components/layout/ContentPanel';

const Dashboard = () => {
	const { t } = useTranslation();

	return <ContentPanel title={t('menu.dashboard')} />;
};

export default Dashboard;
