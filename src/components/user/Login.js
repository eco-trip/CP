import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Divider, Checkbox, Card, Col, Row, Modal, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/pro-solid-svg-icons';

import ForgotPasswordPopover from './ForgotPasswordPopover';
import Api from '../../helpers/api';
import AppContext from '../../helpers/AppContext';

const Login = () => {
	const { t, i18n } = useTranslation();
	const { setLogged } = useContext(AppContext);

	const MODE = { INIT: t('login.continue'), LOGIN: t('login.login'), REGISTER: t('login.register') };

	const passwordRef = useRef();

	const [loginMode, setLoginMode] = useState(MODE.INIT);
	const [pwdError, setPwdError] = useState(false);
	const [reset, setReset] = useState(false);
	const [privacyError, setPrivacyError] = useState(false);
	const [emailValue, setEmailValue] = useState('');

	const [form] = Form.useForm();

	const handleBack = () => setLoginMode(MODE.INIT);

	useEffect(() => {
		if (reset) {
			setLoginMode(MODE.INIT);
			setReset(false);
			form.resetFields();
		}
	}, [reset]);

	const handleCheckEmail = email =>
		Api.get(`/auth/email/${email}`)
			.then(() => {
				setLoginMode(MODE.LOGIN);
				passwordRef.current.focus();
			})
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 404) {
					setLoginMode(MODE.REGISTER);
					return passwordRef.current.focus();
				}
				return err.globalHandler && err.globalHandler();
			});

	const handleLogin = (email, password) =>
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

	const handleRegister = (email, password, name, lastname, privacy) => {
		if (!privacy) {
			return setPrivacyError(t('core:errors.201'));
		}

		return Api.post('/auth/register', { email, password, name, lastname, lang: i18n.language })
			.then(res => {
				setLogged(res.data);
				i18n.changeLanguage(res.data.lang);
			})
			.catch(err => err.globalHandler && err.globalHandler());
	};

	const handleSubmit = ({ email = '', password = '', name = '', lastname = '', privacy = false }) => {
		if (loginMode === MODE.INIT) return handleCheckEmail(email);
		if (loginMode === MODE.LOGIN) return handleLogin(email, password);
		return handleRegister(email, password, name, lastname, privacy);
	};

	const validateMessages = { required: t('core:errors.201') };

	const privacyLink = () => {
		const str = t('login.privacy_check').split('%s');
		return (
			<>
				{str[0]}
				<Link to="/#">{t('login.privacy')}</Link>
				{str[1]}
			</>
		);
	};

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
						onFinish={handleSubmit}
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
								readOnly={loginMode !== MODE.INIT}
								placeholder={t('core:fields.email')}
								value={emailValue}
								onChange={value => setEmailValue(value)}
							/>
						</Form.Item>
						{loginMode !== MODE.INIT && (
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
						)}

						{loginMode === MODE.REGISTER && (
							<>
								<Divider />
								<Form.Item
									name="name"
									rules={[
										{
											required: true
										}
									]}
								>
									<Input placeholder={t('common.name')} maxLength="128" />
								</Form.Item>

								<Form.Item
									name="lastname"
									rules={[
										{
											required: true
										}
									]}
								>
									<Input placeholder={t('login.lastname')} maxLength="128" />
								</Form.Item>
								<Divider />
								<Form.Item
									name="privacy"
									valuePropName="checked"
									validateStatus={privacyError ? 'error' : undefined}
									help={privacyError || undefined}
									onChange={() => setPrivacyError(false)}
									rules={[
										{
											required: true
										}
									]}
								>
									<Checkbox>{privacyLink()}</Checkbox>
								</Form.Item>
							</>
						)}

						{loginMode === MODE.LOGIN && (
							<Form.Item className="align-center">
								<Popover content={<ForgotPasswordPopover email={emailValue} />} trigger="click" placement="top">
									<Link to="/#">{t('login.forgotPassword')}</Link>
								</Popover>
							</Form.Item>
						)}
						<Row wrap={false}>
							{loginMode !== MODE.INIT ? (
								<Col flex="none">
									<Button onClick={() => handleBack()}>{t('common.back')}</Button>
								</Col>
							) : (
								''
							)}
							<Col flex="auto" className="align-right">
								<Button form="loginForm" type="primary" htmlType="submit">
									{loginMode}
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
