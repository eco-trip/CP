/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImageSlash } from '@fortawesome/pro-solid-svg-icons';

const TableImage = ({ url, link = false, ...props }) => {
	const image = url ? (
		<Image src={url} preview={false} {...props} />
	) : (
		<div className="table-image-empty">
			<FontAwesomeIcon icon={faImageSlash} />
		</div>
	);

	return link ? <Link to={link}>{image}</Link> : image;
};

export default TableImage;
