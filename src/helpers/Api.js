/* eslint-disable no-param-reassign */
import { useEffect, useContext } from 'react';
import { Modal } from 'antd';
import axios from 'axios';

import i18n from './i18n';
import AppContext from './AppContext';

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

let refreshTokenPromise = false;

export const ApiInterceptor = ({ children }) => {
	const { sessionInfo, refreshToken, signOut } = useContext(AppContext);

	useEffect(() => {
		const reqInterceptor = config => {
			if (sessionInfo?.accessToken) {
				config.headers = {
					authorization: `Bearer ${sessionInfo.accessToken}`
				};
			}

			return config;
		};
		const reqErrInterceptor = error => {
			Promise.reject(error);
		};

		const resInterceptor = response => response;
		const resErrInterceptor = error => {
			error.globalHandler = errorComposer(error);

			const prevRequest = error?.config;
			const statusCode = error?.response?.status;

			if (statusCode === 401 && sessionInfo?.refreshToken && !prevRequest?.__isRetryRequest) {
				try {
					prevRequest.__isRetryRequest = true;

					if (!refreshTokenPromise) {
						refreshTokenPromise = refreshToken(sessionInfo.refreshToken);
						refreshTokenPromise.then(res => {
							refreshTokenPromise = null;
							return res;
						});
					}

					return refreshTokenPromise.then(() =>
						// necessary to allow time for the state to update to include a new token in requests
						// eslint-disable-next-line no-promise-executor-return
						new Promise(resolve => setTimeout(resolve, 1)).then(() => Api(prevRequest))
					);
				} catch (err) {
					signOut();
				}
			}

			if (statusCode === 401) {
				signOut();
			}

			return Promise.reject(error);
		};

		const requestInterceptor = Api.interceptors.request.use(reqInterceptor, reqErrInterceptor);
		const responseInterceptor = Api.interceptors.response.use(resInterceptor, resErrInterceptor);

		return () => {
			Api.interceptors.request.eject(requestInterceptor);
			Api.interceptors.response.eject(responseInterceptor);
		};
	}, [sessionInfo]);

	return children;
};

export default Api;
