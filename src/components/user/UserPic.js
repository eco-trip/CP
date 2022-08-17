/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Skeleton, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';

import AppContext from '../../helpers/AppContext';
import Api from '../../helpers/api';

const UserPic = props => {
	const { user, size, link, loadPic, ...spreadProps } = props;
	const { logged } = useContext(AppContext);
	const [info, setInfo] = useState(null);

	useEffect(() => {
		if (user) {
			if (user.id === undefined) user.id = user._id;

			if (logged && logged.id === user.id) {
				setInfo(logged);
			} else if (!user.picUrl && loadPic) {
				Api.get('/users/' + user.id + '/pic')
					.then(res => {
						setInfo({ ...user, picUrl: res.data });
					})
					.catch(setInfo(user));
			} else {
				setInfo(user);
			}
		}
	}, [user]);

	const el = info ? (
		<Tooltip title={info.fullname} placement="top">
			<Avatar
				{...spreadProps}
				size={size}
				src={info.picUrl ? info.picUrl : <FontAwesomeIcon icon={faUser} />}
				alt={info.fullname}
			/>
		</Tooltip>
	) : (
		<Skeleton.Avatar active size={size} />
	);

	if (link && info) {
		return (
			<Link className="userPic" to={'/profile/' + info.id}>
				{el}
			</Link>
		);
	}

	return <span className="userPic">{el}</span>;
};

export default React.memo(UserPic);
