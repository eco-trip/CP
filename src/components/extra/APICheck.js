/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSync, faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';

import Api from '../../helpers/api';

const APICheck = props => {
	const [message, setMessage] = useState('Loading...');
	const [check, setCheck] = useState(0);

	useEffect(() => {
		Api.get('/')
			.then(res => {
				setMessage(res.data.message);
				setCheck(1);
			})
			.catch(err => {
				setCheck(-1);
				return err.globalHandler && err.globalHandler();
			});
	}, []);

	const icon =
		check === 1 ? (
			<FontAwesomeIcon icon={faCheckCircle} />
		) : check === 0 ? (
			<FontAwesomeIcon icon={faSync} />
		) : (
			<FontAwesomeIcon icon={faExclamationCircle} />
		);
	const color = check === 1 ? 'success' : check === 0 ? 'warning' : 'danger';

	return (
		<div bg={color}>
			{icon} {message}
		</div>
	);
};

export default APICheck;
