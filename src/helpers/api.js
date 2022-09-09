/* eslint-disable no-param-reassign */
import axios from 'axios';
import { Modal } from 'antd';

import i18n from './i18n';

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

/*
let refreshTokenPromise;
const getRefreshedToken = () => Api.get('/auth/rt');
*/

Api.interceptors.response.use(
	response => response,
	error => {
		error.globalHandler = errorComposer(error);

		/*
		const prevRequest = error?.config;
		const statusCode = error?.response?.status;
		const customErrorCode = error?.response?.data?.error;

		if (statusCode === 401 && !prevRequest?.sent) {
			prevRequest.sent = true;

			if (!refreshTokenPromise) {
				refreshTokenPromise = getRefreshedToken().then(res => {
					refreshTokenPromise = null;
					return res;
				});
			}
			return refreshTokenPromise.then(() => Api(prevRequest));
		}

		if ([305, 306, 307, 401].includes(customErrorCode) && JSON.parse(window.localStorage.getItem('user'))) {
			window.localStorage.setItem('user', null);
			return Api.get('/auth/logout')
				.then(window.location.replace(window.location.origin))
				.catch(window.location.replace(window.location.origin));
		}
		*/
		return Promise.reject(error);
	}
);

export default Api;
