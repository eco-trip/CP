import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import itLocale from 'i18n-iso-countries/langs/it.json';

const CountrySelect = ({ value = '', onChange }) => {
	const { i18n } = useTranslation();
	const { language } = i18n;

	countries.registerLocale(enLocale);
	countries.registerLocale(itLocale);

	const countryObj = countries.getNames(language, { select: 'official' });

	const options = Object.entries(countryObj).map(([k, v]) => ({
		value: k,
		label: v
	}));

	const filterHandler = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	return (
		<Select
			showSearch
			value={value}
			optionFilterProp="children"
			filterOption={filterHandler}
			options={options}
			onChange={v => onChange(v)}
		/>
	);
};

export default CountrySelect;
