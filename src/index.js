import React from 'react';
import { createRoot } from 'react-dom/client';
import Routes from './routes';

import { AppProvider } from './helpers/AppContext';
import { ApiInterceptor } from './helpers/Api';

import './helpers/i18n';
import './styles/app.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<AppProvider>
		<ApiInterceptor>
			<Routes />
		</ApiInterceptor>
	</AppProvider>
);
