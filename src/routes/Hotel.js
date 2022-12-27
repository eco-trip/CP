import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Input, Button, InputNumber } from 'antd';

import ContentPanel from '../components/layout/ContentPanel';
import {
	loadingNotification,
	savedNotification,
	errorNotification,
	notification
} from '../components/controls/Notifications';
import CountrySelect from '../components/controls/CountrySelect';

import Api from '../helpers/Api';

const Dashboard = () => {
	const { t } = useTranslation();
	const { id: hotelId } = useParams();
	const navigate = useNavigate();
	const [form] = Form.useForm();

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

	useEffect(() => {
		form.setFieldsValue(hotel);
	}, [hotel]);

	const saveInfo = data => {
		loadingNotification();

		return Api.patch(`/hotels/${hotelId}`, data)
			.then(() => notification.close('loading'))
			.then(() => savedNotification())
			.then(() => getHotel())
			.catch(err => {
				notification.close('loading');
				return errorNotification(err);
			});
	};

	return (
		<ContentPanel title={hotel ? hotel.name : ''} back={() => navigate(`/hotels`)} loading={loading}>
			<Card title={t('hotel.info')}>
				<Form form={form} layout="vertical" onFinish={data => saveInfo(data)}>
					<Row className="gutter-row">
						<Col xs={24} md={12}>
							<Form.Item name="name" label={t('hotel.name')}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="cost" label={t('hotel.cost')}>
								<InputNumber />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name="description" label={t('hotel.description')}>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="country" label={t('hotel.country')}>
								<CountrySelect />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="city" label={t('hotel.city')}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="address" label={t('hotel.address')}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="zipcode" label={t('hotel.zipcode')}>
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
		</ContentPanel>
	);
};

export default Dashboard;
