import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import i18n from '../../helpers/i18n';

const { notification: Notification } = require('antd');

export const loadingNotification = () => {
	Notification.open({
		message: i18n.t('common.saving'),
		description: i18n.t('common.savingInProgress'),
		icon: <FontAwesomeIcon icon={faSpinnerThird} style={{ color: '#108ee9' }} spin />,
		key: 'loading',
		duration: 0
	});
};

export const savedNotification = () => {
	Notification.success({
		message: i18n.t('common.success'),
		description: i18n.t('common.saved')
	});
};

export const errorNotification = err => {
	Notification.error({
		message: i18n.t('common.error'),
		description:
			err.response && err.response.data
				? i18n.t(`core:errors.${err.response.data.error}`, err.toString())
				: err.toString()
	});
};

export const notification = Notification;
