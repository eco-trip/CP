import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Card, Col, Row, Modal, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/pro-solid-svg-icons';

import ForgotPasswordPopover from './ForgotPasswordPopover';
import AppContext from '../../helpers/AppContext';

const Login = () => {
	const { t } = useTranslation();
	const { setLogged } = useContext(AppContext);

	const passwordRef = useRef();

	const [pwdError, setPwdError] = useState(false);
	const [reset, setReset] = useState(false);
	const [emailValue, setEmailValue] = useState('');

	const [form] = Form.useForm();

	useEffect(() => {
		if (reset) {
			setReset(false);
			form.resetFields();
		}
	}, [reset]);

	const handleLogin = ({ email = '', password = '' }) => {
		if (email === 'admin@meblabs.com' && password === 'testtest') setLogged({ id: 'admin', fullname: 'admin' });
		else setPwdError(t('core:errors.301'));

		/*
		Api.post(`/auth/login`, { email, password })
			.then(res => {
				setLogged(res.data);
				i18n.changeLanguage(res.data.lang);
			})
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 301) return setPwdError(t('core:errors.' + errorCode));

				return err.globalHandler && err.globalHandler();
			});
			*/
	};

	const validateMessages = { required: t('core:errors.201') };

	return navigator.cookieEnabled ? (
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
							rules={[
								{
									required: true
								},
								{
									type: 'email',
									message: t('core:errors.210')
								}
							]}
						>
							<Input
								autoFocus
								prefix={<FontAwesomeIcon icon={faUser} />}
								placeholder={t('core:fields.email')}
								value={emailValue}
								onChange={value => setEmailValue(value)}
							/>
						</Form.Item>

						<Form.Item
							name="password"
							validateStatus={pwdError ? 'error' : undefined}
							help={pwdError || undefined}
							onChange={() => setPwdError(false)}
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

						<Form.Item className="align-center">
							<Popover content={<ForgotPasswordPopover email={emailValue} />} trigger="click" placement="top">
								<Link to="/#">{t('login.forgotPassword')}</Link>
							</Popover>
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
	) : (
		Modal.error({
			title: t('cookie.title'),
			content: t('cookie.message')
		})
	);
};

export default Login;
