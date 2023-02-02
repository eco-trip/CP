/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useState } from 'react';
import { Table as AntTable, Popconfirm, Button, Space, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck, faTimes, faEdit, faSearch, faAdd } from '@fortawesome/pro-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';

import AppContext from '../../helpers/AppContext';

const Table = ({
	dataSource = [],
	infinite = false,
	topButtons = true,
	topButtonsPrivilegesRequired = false,
	className,
	addButton = false,
	onAdd = () => {},
	onEscape = () => {},
	onEnter = () => {},
	deleteSaveButtonOnRow = false,
	editCancelButtonOnRow = false,
	onDelete = () => {},
	onSave = () => {},
	onCancel = () => {},
	onEdit = () => {},
	isRecordEditing = () => false,
	isTableEditing = false,
	columns: initColumns,
	searchBar = false,
	onChangeSearchBar = () => {},
	sortableKeys = [],
	pagination = false,
	...props
}) => {
	const { t } = useTranslation();
	const { fullPrivileges } = useContext(AppContext);
	const [columns, setColumns] = useState(initColumns);

	useEffect(() => {
		let newColumns = initColumns;
		if (deleteSaveButtonOnRow) {
			newColumns = newColumns.concat([
				{
					dataIndex: 'deleteSave',
					className: 'button-cell last-cell',
					render: (_, record) =>
						isRecordEditing(record) ? (
							<Button type="link" onClick={() => onSave(record)}>
								<FontAwesomeIcon icon={faCheck} />
							</Button>
						) : (
							<Popconfirm
								placement="left"
								title={t('common.sureToDelete')}
								onConfirm={() => onDelete(record)}
								okText={t('common.yes')}
								cancelText={t('common.no')}
								disabled={isTableEditing}
							>
								<Button type="text" className="btn-del" disabled={isTableEditing}>
									<FontAwesomeIcon icon={faTrashAlt} />
								</Button>
							</Popconfirm>
						)
				}
			]);
		}

		if (editCancelButtonOnRow) {
			newColumns = [
				{
					dataIndex: 'edit',
					className: 'button-cell first-cell',
					editable: false,
					render: (_, record) =>
						isRecordEditing(record) ? (
							<Button type="text" onClick={() => onCancel(record)} danger>
								<FontAwesomeIcon icon={faTimes} />
							</Button>
						) : (
							<Button type="text" className="btn-edit" disabled={isTableEditing} onClick={() => onEdit(record)}>
								<FontAwesomeIcon icon={faEdit} />
							</Button>
						)
				}
			].concat(newColumns);
		}

		newColumns.forEach(col => {
			if (sortableKeys.includes(col.key)) {
				col.sorter = col.sorter || true;
				col.sortDirections = col.sortDirections || ['ascend', 'descend', 'ascend'];
			}

			const tmpRender = col.render || null;
			col.render = (value, record) => (
				<div className="responsive-table-cell" data-title={col.title}>
					{(tmpRender && tmpRender(value, record)) || value || ''}
				</div>
			);
		});

		return setColumns([...newColumns]);
	}, [initColumns]);

	// eslint-disable-next-line consistent-return
	const keyListener = event => {
		switch (event.code) {
			case 'Escape':
				return onEscape();
			case 'Enter':
				return onEnter();
			default:
				break;
		}
	};

	useEffect(() => {
		window.removeEventListener('keydown', keyListener);
		if (isTableEditing) {
			window.addEventListener('keydown', keyListener, false);
		}
		return () => {
			window.removeEventListener('keydown', keyListener);
		};
	});

	return (
		<div className={className}>
			<Space className="table-header">
				{searchBar ? (
					<Input
						onChange={onChangeSearchBar}
						className="table-search-bar"
						disabled={isTableEditing}
						suffix={<FontAwesomeIcon icon={faSearch} />}
					/>
				) : (
					<div />
				)}
				<Space className="top-table-button-container">
					{((topButtonsPrivilegesRequired && fullPrivileges) || !topButtonsPrivilegesRequired) && addButton && (
						<Button type="primary" onClick={onAdd} icon={<FontAwesomeIcon icon={faAdd} />} disabled={isTableEditing} />
					)}
					{((topButtonsPrivilegesRequired && fullPrivileges) || !topButtonsPrivilegesRequired) && topButtons}
				</Space>
			</Space>
			{infinite ? (
				<InfiniteScroll dataLength={dataSource.length} {...infinite}>
					<AntTable
						{...props}
						dataSource={dataSource}
						columns={columns}
						className="responsive-table"
						pagination={pagination}
						showSorterTooltip={false}
					/>
				</InfiniteScroll>
			) : (
				<AntTable
					{...props}
					dataSource={dataSource}
					columns={columns}
					className="responsive-table"
					pagination={pagination}
					showSorterTooltip={false}
				/>
			)}
		</div>
	);
};

export default Table;
