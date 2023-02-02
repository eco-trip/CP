import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import 'moment/locale/it';
import { allowedLanguages, defaultLanguage } from '../config';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: defaultLanguage,
		debug: process.env.NODE_ENV === 'dev',
		supportedLngs: allowedLanguages,
		defaultNS: 'common',
		ns: ['common', 'core']
	});

i18n.on('languageChanged', lng => {
	moment.locale(lng);
});

export default i18n;
