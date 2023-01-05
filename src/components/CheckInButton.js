import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import Api from '../helpers/Api';

const CheckInButton = ({ roomId, disabled }) => {
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [stay, setStay] = useState(null);

	useEffect(() => {
		Api.get(`/rooms/${roomId}/currentStay`)
			.then(res => {
				setLoading(false);
				setStay(res.data);
			})
			.catch(err => {
				setLoading(false);
				return err.globalHandler && err.globalHandler();
			});
	}, []);

	const onClick = () => {
		setLoading(true);

		if (!stay) {
			Api.put(`/rooms/${roomId}/stays`, { startTime: new Date() })
				.then(res => {
					setLoading(false);
					setStay(res.data);
				})
				.catch(err => {
					setLoading(false);
					return err.globalHandler && err.globalHandler();
				});
		} else {
			Api.patch(`/stays/${stay.id}`, { endTime: new Date() })
				.then(res => {
					setLoading(false);
					setStay(null);
				})
				.catch(err => {
					setLoading(false);
					return err.globalHandler && err.globalHandler();
				});
		}
	};

	return (
		<Button type="primary" loading={loading} disabled={disabled} danger={stay} block onClick={onClick}>
			{stay ? t('rooms.checkout') : t('rooms.checkin')}
		</Button>
	);
};

export default CheckInButton;
