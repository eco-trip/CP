import React from 'react';
import { Space, Avatar } from 'antd';

import UserPic from './UserPic';

const UserInfo = ({ user, mobile = false, link = true, left = false }) =>
	user ? (
		<div className={'user-tpl' + (left ? ' left' : '')}>
			<Space>
				{!mobile && (
					<div className="logged-info">
						<p>{user.fullname}</p>
					</div>
				)}
				<Avatar.Group>
					<UserPic user={user} link={link} />
				</Avatar.Group>
			</Space>
		</div>
	) : null;

export default UserInfo;
