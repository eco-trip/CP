import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Form, Row, Col, Input, Button, InputNumber } from 'antd';

import {
	loadingNotification,
	savedNotification,
	errorNotification,
	notification
} from '../components/controls/Notifications';
import CountrySelect from '../components/controls/CountrySelect';

import Api from '../helpers/Api';

const HotelDetails = ({ hotel, onSave }) => {
	const { t } = useTranslation();
	const { id: hotelId } = useParams();

	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(hotel);
	}, [hotel]);

	const saveInfo = data => {
		loadingNotification();

		return Api.patch(`/hotels/${hotelId}`, data)
			.then(() => notification.close('loading'))
			.then(() => savedNotification())
			.then(() => onSave())
			.catch(err => {
				notification.close('loading');
				return errorNotification(err);
			});
	};

	return (
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
	);
};

export default HotelDetails;
