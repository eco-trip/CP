/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Input, Button, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';

import { loadingNotification, savedNotification, notification } from '../components/controls/Notifications';
import { ContentLoading } from '../components/layout/ContentPanel';

import Api from '../helpers/Api';

const HotelUser = ({ hotel }) => {
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	const getUser = () =>
		Api.get(`/hotels/${hotel.id}/user`)
			.then(res => {
				setLoading(false);
				if (res.data.length === 0) setUser(null);
				else {
					const userMap = res.data[0].Attributes.reduce(
						(accumulator, v) => ({ ...accumulator, [v.Name]: v.Value }),
						{}
					);
					setUser(userMap);
				}
			})
			.catch(err => err.globalHandler && err.globalHandler());

	useEffect(() => setLoading(true), []);

	useEffect(() => {
		if (hotel?.id) getUser();
	}, [hotel]);

	const saveInfo = data => {
		loadingNotification();

		return Api.put(`/hotels/${hotel.id}/user`, data)
			.then(() => notification.close('loading'))
			.then(() => savedNotification())
			.then(() => setLoading(true))
			.then(() => getUser())
			.catch(err => {
				notification.close('loading');
				console.log(err);
				return err.globalHandler && err.globalHandler();
			});
	};

	if (loading) return <ContentLoading />;

	const validateMessages = { required: t('core:errors.201') };

	return (
		<>
			{!user ? (
				<Card title={t('user.add')}>
					<Form
						form={form}
						layout="vertical"
						requiredMark={false}
						validateMessages={validateMessages}
						onFinish={data => saveInfo(data)}
					>
						<Row className="gutter-row">
							<Col xs={24} md={12}>
								<Form.Item
									name="email"
									label={t('core:fields.email')}
									rules={[
										{
											required: true
										}
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="password"
									label={t('core:fields.password')}
									rules={[
										{
											required: true
										}
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="name"
									label={t('user.name')}
									rules={[
										{
											required: true
										}
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="family_name"
									label={t('user.lastname')}
									rules={[
										{
											required: true
										}
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} className="align-right">
								<Button type="primary" htmlType="submit">
									{t('common.save')}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			) : (
				<Card>
					<Card.Meta
						avatar={<Avatar size={64} src={<FontAwesomeIcon icon={faUser} />} />}
						title={user.name + ' ' + user.family_name}
						description={user.email}
					/>
				</Card>
			)}
		</>
	);
};

export default HotelUser;
