import { Button, Space } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Api from '../../helpers/api';

const ForgotPasswordPopover = props => {
	const { t } = useTranslation();
	const [textValue, setTextValue] = useState(t('login.sureToChangePassword'));
	const [showButton, setShowButton] = useState(true);
	const { value: email } = props.email.target;

	const handleYes = () =>
		Api.post(`/auth/forgotPassword`, { email })
			.then(() => {
				setTextValue(t('login.changePasswordEmailSent'));
				setShowButton(false);
			})
			.catch(err => err.errorHandler && err.errorHandler());

	return (
		<Space direction="vertical">
			<p className="no-bottom">{textValue}</p>
			{showButton && (
				<div className="align-right">
					<Button type="primary" onClick={() => handleYes()}>
						{t('common.yes')}
					</Button>
				</div>
			)}
		</Space>
	);
};

export default ForgotPasswordPopover;
