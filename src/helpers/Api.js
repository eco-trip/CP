/* eslint-disable no-param-reassign */
import { useEffect, useContext, useState } from 'react';
import { Modal } from 'antd';
import axios from 'axios';

import i18n from './i18n';
import AppContext from './AppContext';
// import * as cognito from './cognito';

const Api = axios.create({ baseURL: process.env.REACT_APP_ENDPOINT, withCredentials: true });

const errorComposer = error => () => {
	console.error(error);

	if (error.response?.data) {
		Modal.error({
			title: `[${error.response.data.error}] ${i18n.t('common.error')}`,
			content: i18n.t(`core:errors.${error.response.data.error}`)
		});
	} else {
		Modal.error({
			title: i18n.t('common.error'),
			content: error.message ? error.message : error.toString()
		});
	}
};

export const ApiInterceptor = ({ children }) => {
	const { sessionInfo } = useContext(AppContext);
	// const [refreshTokenRequest, setRefreshTokenRequest] = useState(false);

	useEffect(() => {
		Api.interceptors.request.use(
			config => {
				if (sessionInfo?.accessToken) {
					config.headers = {
						authorization: `Bearer ${sessionInfo.accessToken}`
					};
				}

				return config;
			},
			error => {
				Promise.reject(error);
			}
		);

		Api.interceptors.response.use(
			response => response,
			async error => {
				error.globalHandler = errorComposer(error);

				/*
				const prevRequest = error?.config;
				const statusCode = error?.response?.status;

				if (statusCode === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;

					if (sessionInfo?.refreshToken && !refreshTokenRequest) {
						try {
							setRefreshTokenRequest(true);
							const session = await cognito.refreshToken(sessionInfo.refreshToken);
							setRefreshTokenRequest(false);
							console.log('refresh token');
							console.log(session);
						} catch (err) {
							setRefreshTokenRequest(false);
							console.log('error refresh token');
							throw err;
						}
					}
					// return Api(prevRequest);
				}

				if (statusCode === 401) {
					// logout
				}
				*/

				return Promise.reject(error);
			}
		);
	}, [sessionInfo]);

	return children;
};

export default Api;
