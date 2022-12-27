/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
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

const Dashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [editingId, setEditingId] = useState(null);
	// const [search, setSearch] = useState('');
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

	/*
	useEffect(() => {
		const toDisplay = data.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

		setData([...toDisplay]);
	}, [search]);
	*/

	const cancel = () => {
		setEditingId(null);
		get();
	};

	const isEditing = record => record.id === editingId;

	const edit = record => {
		form.setFieldsValue({
			name: record.name || '',
			id: record.id
		});

		setEditingId(record.id);
	};

	const add = () => {
		if (editingId !== null) return;

		form.setFieldsValue({
			name: '',
			id: 0
		});

		setData([
			{
				name: '',
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
			title: t('hotels.id'),
			dataIndex: 'id',
			key: 'id',
			width: '40%',
			render: (value, record) =>
				isEditing(record) ? (
					value === 0 ? (
						<span className="small-cell-text">-</span>
					) : (
						<Form.Item name="id">
							<Input disabled />
						</Form.Item>
					)
				) : (
					<span className="small-cell-text">{value}</span>
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
						<Input placeholder={t('hotels.namePlaceholder')} autoFocus />
					</Form.Item>
				) : (
					value
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
					// searchBar
					// onChangeSearchBar={e => setSearch(e.target.value)}
					isTableEditing={editingId !== null}
					onRow={record => ({
						onDoubleClick: () => !editingId !== null && record.id && edit(record)
					})}
				/>
			</Form>
		</ContentPanel>
	);
};

export default Dashboard;
