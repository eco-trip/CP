import React, { useState, useEffect } from 'react';
import { List, Tag, Space, Card, Typography, Button, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons';

import Api from '../helpers/Api';

const { Text } = Typography;

const StaysList = ({ roomId, onStayDel, refresh }) => {
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [stays, setStays] = useState([]);

	const get = () =>
		Api.get(`/rooms/${roomId}/stays`)
			.then(res => {
				setLoading(false);
				setStays(res.data);
			})
			.catch(err => {
				setLoading(false);
				return err.globalHandler && err.globalHandler();
			});

	useEffect(() => {
		get();
	}, [refresh]);

	const onDel = stayId => {
		setLoading(true);
		Api.delete(`/stays/${stayId}`)
			.then(res => {
				get();
				onStayDel(roomId);
			})
			.catch(err => {
				setLoading(false);
				return err.globalHandler && err.globalHandler();
			});
	};

	const dateTime = time => (time ? <Moment format="DD/MM/YYYY HH:mm">{time}</Moment> : '-');

	const card = item => (
		<Card
			type="inner"
			title={
				<Space>
					{t('stays.title')}
					<Tag color="orange" className="stay-id">
						{item.id}
					</Tag>
				</Space>
			}
			extra={
				<Button type="text" danger onClick={() => onDel(item.id)}>
					<FontAwesomeIcon key="del" icon={faTrashAlt} />
				</Button>
			}
		>
			<p>
				<Text type="secondary">{t('stays.start')}:</Text> {dateTime(item.startTime)}
			</p>
			<p>
				<Text type="secondary">{t('stays.end')}:</Text> {dateTime(item.endTime)}
			</p>
		</Card>
	);

	return (
		<List
			itemLayout="horizontal"
			dataSource={stays}
			loading={loading}
			className="stays-list"
			renderItem={item => (
				<List.Item>
					{item.endTime ? (
						card(item)
					) : (
						<Badge.Ribbon text={t('stays.open')} placement="start" color="cyan">
							{card(item)}
						</Badge.Ribbon>
					)}
				</List.Item>
			)}
		/>
	);
};

export default StaysList;
