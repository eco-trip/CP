/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import Table from '../components/layout/Table';
import {
	loadingNotification,
	savedNotification,
	errorNotification,
	notification
} from '../components/controls/Notifications';
import CheckInButton from '../components/CheckInButton';

import Api from '../helpers/Api';

const Hotels = ({ hotel }) => {
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [form] = Form.useForm();

	const get = () =>
		Api.get(`/hotels/${hotel.id}/rooms`)
			.then(res => {
				setLoading(false);
				setData(res.data);
			})
			.catch(err => err.globalHandler && err.globalHandler());

	useEffect(() => {
		if (hotel?.id) {
			setLoading(true);
			get();
		}
	}, [hotel]);

	const cancel = () => {
		setEditingId(null);
		get();
	};

	const isEditing = record => record.id === editingId;

	const edit = record => {
		form.setFieldsValue({
			floor: record.floor || '',
			number: record.number || '',
			id: record.id
		});

		setEditingId(record.id);
	};

	const add = () => {
		if (editingId !== null) return;

		form.setFieldsValue({
			floor: '',
			number: '',
			id: 0
		});

		setData([
			{
				floor: '',
				number: '',
				id: 0
			},
			...data
		]);

		setEditingId(0);
	};

	const save = async record => {
		if (editingId === null) return null;

		loadingNotification();

		try {
			const row = await form.validateFields();
			delete row.id;

			let upsert;
			if (editingId === 0) {
				upsert = () => Api.put(`/hotels/${hotel.id}/rooms`, { ...row });
			} else {
				upsert = () => Api.patch(`/rooms/${editingId}`, { ...row });
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
		Api.delete(`/rooms/${id}`)
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
			title: t('rooms.floor'),
			dataIndex: 'floor',
			key: 'floor',
			sorter: (a, b) => a.floor - b.floor,
			defaultSortOrder: 'ascend',
			render: (value, record) =>
				isEditing(record) ? (
					<Form.Item
						name="floor"
						rules={[
							{
								required: true,
								message: t('core:errors.201')
							}
						]}
					>
						<InputNumber autoFocus />
					</Form.Item>
				) : (
					value
				)
		},
		{
			title: t('rooms.number'),
			dataIndex: 'number',
			key: 'number',
			sorter: (a, b) => a.number - b.number,
			defaultSortOrder: 'ascend',
			render: (value, record) =>
				isEditing(record) ? (
					<Form.Item
						name="number"
						rules={[
							{
								required: true,
								message: t('core:errors.201')
							}
						]}
					>
						<Input />
					</Form.Item>
				) : (
					value
				)
		},
		{
			title: '',
			dataIndex: 'currentStay',
			key: 'currentStay',
			className: 'table-button',
			render: (value, record) =>
				isEditing(record) ? <CheckInButton roomId={record.id} disabled /> : <CheckInButton roomId={record.id} />
		}
	];

	return (
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
				onEdit={record => edit(record)}
				onSave={save}
				onEnter={save}
				isTableEditing={editingId !== null}
				onRow={record => ({
					onDoubleClick: () => !editingId !== null && record.id && edit(record)
				})}
			/>
		</Form>
	);
};

export default Hotels;
