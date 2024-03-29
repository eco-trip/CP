/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Tag, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ContentPanel from '../components/layout/ContentPanel';
import Table from '../components/layout/Table';
import {
	loadingNotification,
	savedNotification,
	errorNotification,
	notification
} from '../components/controls/Notifications';

import Api from '../helpers/Api';

const { Text } = Typography;

const Hotels = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [form] = Form.useForm();

	const get = () =>
		Api.get('/hotels')
			.then(res => {
				setLoading(false);
				setData(res.data);
			})
			.catch(err => err.globalHandler && err.globalHandler());

	useEffect(() => {
		setLoading(true);
		get();
	}, []);

	const cancel = () => {
		setEditingId(null);
		get();
	};

	const isEditing = record => record.id === editingId;

	const edit = record => {
		form.setFieldsValue({
			id: record.id,
			name: record.name || '',
			electricityCost: record.electricityCost || '',
			hotWaterCost: record.hotWaterCost || ''
		});

		setEditingId(record.id);
	};

	const add = () => {
		if (editingId !== null) return;

		form.setFieldsValue({
			id: 0,
			name: '',
			electricityCost: '',
			hotWaterCost: ''
		});

		setData([
			{
				id: 0,
				name: '',
				electricityCost: '',
				hotWaterCost: ''
			},
			...data
		]);

		setEditingId(0);
	};

	const save = async record => {
		if (editingId === null) return null;

		try {
			const row = await form.validateFields();
			delete row.id;

			loadingNotification();

			let upsert;
			if (editingId === 0) {
				upsert = () => Api.post(`/hotels`, { ...row });
			} else {
				upsert = () => Api.patch(`/hotels/${editingId}`, { ...row });
			}

			return upsert()
				.then(() => notification.close('loading'))
				.then(() => savedNotification())
				.then(() => cancel())
				.then(() => get())
				.catch(err => {
					notification.close('loading');
					return errorNotification(err);
				});
		} catch (err) {
			return notification.close('loading');
		}
	};

	const confirmDelete = ({ id }) => {
		loadingNotification();
		Api.delete(`/hotels/${id}`)
			.then(() => notification.close('loading'))
			.then(() => savedNotification())
			.then(() => get())
			.catch(err => {
				notification.close('loading');
				return errorNotification(err);
			});
	};

	const columns = [
		{
			dataIndex: 'id',
			key: 'id',
			className: 'table-id',
			render: (value, record) =>
				isEditing(record) ? (
					value === 0 ? (
						<Tag>-</Tag>
					) : (
						<Form.Item name="id">
							<Input size="small" disabled />
						</Form.Item>
					)
				) : (
					<Tag>{value}</Tag>
				)
		},
		{
			title: t('hotels.name'),
			dataIndex: 'name',
			key: 'name',
			render: (value, record) =>
				isEditing(record) ? (
					<Form.Item
						name="name"
						rules={[
							{
								required: true,
								message: t('core:errors.201')
							}
						]}
					>
						<Input autoFocus />
					</Form.Item>
				) : (
					value
				)
		},
		{
			title: 'CO2/kw',
			dataIndex: 'electricityCost',
			key: 'electricityCost',
			render: (value, record) =>
				isEditing(record) ? (
					<Form.Item
						name="electricityCost"
						rules={[
							{
								required: false
							}
						]}
					>
						<InputNumber step="0.01" addonAfter="CO2/kw" />
					</Form.Item>
				) : (
					<Space direction="horizontal">
						{value}
						<Text type="secondary">CO2/kw</Text>
					</Space>
				)
		},
		{
			title: 'CO2/l',
			dataIndex: 'hotWaterCost',
			key: 'hotWaterCost',
			render: (value, record) =>
				isEditing(record) ? (
					<Form.Item
						name="hotWaterCost"
						rules={[
							{
								required: false
							}
						]}
					>
						<InputNumber step="0.01" addonAfter="CO2/l" />
					</Form.Item>
				) : (
					<Space direction="horizontal">
						{value}
						<Text type="secondary">CO2/l</Text>
					</Space>
				)
		}
	];

	return (
		<ContentPanel title={t('menu.hotels')}>
			<Form form={form} component={false}>
				<Table
					className="hotel-table"
					rowKey="id"
					loading={loading}
					columns={columns}
					dataSource={data}
					addButton
					onAdd={add}
					deleteSaveButtonOnRow
					editCancelButtonOnRow
					isRecordEditing={isEditing}
					onCancel={cancel}
					onEscape={cancel}
					onDelete={confirmDelete}
					onEdit={record => navigate(`/hotels/${record.id}`)}
					onSave={save}
					onEnter={save}
					isTableEditing={editingId !== null}
					onRow={record => ({
						onDoubleClick: () => !editingId !== null && record.id && edit(record)
					})}
				/>
			</Form>
		</ContentPanel>
	);
};

export default Hotels;
