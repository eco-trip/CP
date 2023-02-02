import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(hotel);
	}, [hotel]);

	const saveInfo = data => {
		loadingNotification();

		return Api.patch(`/hotels/${hotel.id}`, data)
			.then(() => notification.close('loading'))
			.then(() => savedNotification())
			.then(() => onSave())
			.catch(err => {
				notification.close('loading');
				return errorNotification(err);
			});
	};

	return (
		<Card title={t('hotels.info')}>
			<Form form={form} layout="vertical" onFinish={data => saveInfo(data)}>
				<Row className="gutter-row">
					<Col xs={24} md={12}>
						<Form.Item name="name" label={t('hotels.name')}>
							<Input />
						</Form.Item>
					</Col>
					<Col xs={24} md={6}>
						<Form.Item name="electricityCost" label={t('hotels.electricityCost')}>
							<InputNumber step="0.01" addonAfter="CO2/kw" />
						</Form.Item>
					</Col>
					<Col xs={24} md={6}>
						<Form.Item name="hotWaterCost" label={t('hotels.hotWaterCost')}>
							<InputNumber step="0.01" addonAfter="CO2/l" />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name="description" label={t('hotels.description')}>
							<Input.TextArea rows={3} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name="country" label={t('hotels.country')}>
							<CountrySelect />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name="city" label={t('hotels.city')}>
							<Input />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name="address" label={t('hotels.address')}>
							<Input />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name="zipcode" label={t('hotels.zipcode')}>
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
