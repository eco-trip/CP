import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import itFlag from '../../img/flags/it.png';
import gbFlag from '../../img/flags/gb.png';

const LanguageSelector = () => {
	const { i18n } = useTranslation();

	const { language } = i18n;

	const changeLanguage = lang => i18n.changeLanguage(lang);

	return (
		<Select type="text" defaultValue={language} value={language} onChange={changeLanguage}>
			<Select.Option value="it">
				<img height="20" src={itFlag} alt="IT" />
			</Select.Option>
			<Select.Option value="en">
				<img height="20" src={gbFlag} alt="EN" />
			</Select.Option>
		</Select>
	);
};

export default LanguageSelector;
