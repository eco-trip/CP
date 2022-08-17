import { Form, Input, Button, Modal, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Api from '../../helpers/api';

const ChangePassword = () => {
	const { id, token } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [feedback, setFeedback] = useState(null);

	const showModal = () =>
		Modal.info({
			title: t('common.success'),
			content: <h4>{t('login.changePasswordSuccess')}</h4>,
			onOk: () => navigate('/')
		});

	const handleSubmit = ({ password, confirm }) => {
		if (password !== confirm) {
			return setFeedback(t('login.passwordNotMatch'));
		}
		return Api.patch(`/auth/changePassword/${id}/${token}`, { password })
			.then(() => showModal())
			.catch(err => {
				const statusCode = err.response ? err.response.status : null;
				if (statusCode === 401) {
					return setFeedback(t('login.expiredLink'));
				}
				return err.errorHandler && err.errorHandler();
			});
	};

	return (
		<div className="center-content">
			<div className="login-box">
				<Card title={t('login.forgotPasswordTitle')}>
					<Form onFinish={data => handleSubmit(data)} labelCol={{ span: 8 }}>
						<Form.Item
							label={t('core:fields.password')}
							name="password"
							rules={[{ required: true, message: t('core:fields.missingPassword') }]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							label={t('core:fields.confirmPassword')}
							name="confirm"
							rules={[{ required: true, message: t('core:fields.missingPasswordConfirmation') }]}
						>
							<Input.Password />
						</Form.Item>
						{feedback && (
							<Form.Item>
								<p className="loginFeedback">{feedback}</p>
							</Form.Item>
						)}
						<div className="align-right">
							<Button type="primary" htmlType="submit">
								{t('login.confirm')}
							</Button>
						</div>
					</Form>
				</Card>
			</div>
		</div>
	);
};
export default ChangePassword;
