import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Card, Col, Row, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/pro-solid-svg-icons';

import AppContext from '../../helpers/AppContext';

const Login = () => {
	const { t } = useTranslation();
	const { signIn } = useContext(AppContext);
	const [form] = Form.useForm();
	const passwordRef = useRef();

	const [error, setError] = useState(false);

	const handleLogin = ({ email = '', password = '' }) => {
		signIn(email, password)
			.then(() => {})
			.catch(e => {
				switch (e.code) {
					case 'UserNotFoundException':
						setError({ target: 'email', text: t('core:errors.300') });
						break;
					case 'NotAuthorizedException':
						setError({ target: 'password', text: t('core:errors.301') });
						break;
					case 'UserNotConfirmedException':
						setError({ target: 'email', text: t('core:errors.302') });
						break;
					default:
						Modal.error({
							title: `[1] ${t('common.error')}`,
							content: t('core:errors.1')
						});
				}
			});
	};

	const validateMessages = { required: t('core:errors.201') };

	return (
		<div className="center-content">
			<div className="login-box">
				<Card title={t('login.title')}>
					<Form
						id="loginForm"
						form={form}
						layout="vertical"
						requiredMark={false}
						validateMessages={validateMessages}
						onFinish={handleLogin}
					>
						<Form.Item
							name="email"
							validateStatus={error?.target === 'email' ? 'error' : undefined}
							help={error?.target === 'email' ? error.text : undefined}
							onChange={() => setError(false)}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input autoFocus prefix={<FontAwesomeIcon icon={faUser} />} placeholder={t('core:fields.email')} />
						</Form.Item>

						<Form.Item
							name="password"
							validateStatus={error?.target === 'password' ? 'error' : undefined}
							help={error?.target === 'password' ? error.text : undefined}
							onChange={() => setError(false)}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input.Password
								ref={passwordRef}
								prefix={<FontAwesomeIcon icon={faLock} />}
								placeholder={t('core:fields.password')}
							/>
						</Form.Item>

						<Row wrap={false}>
							<Col flex="auto" className="align-right">
								<Button form="loginForm" type="primary" htmlType="submit">
									{t('login.login')}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default Login;
