import React from 'react';
import { Layout, Row, Col, Spin } from 'antd';

const FullpageLoading = () => (
	<Layout className="fullpage-loading">
		<Row type="flex" justify="center" align="middle">
			<Col>
				<Spin />
			</Col>
		</Row>
	</Layout>
);

export default React.memo(FullpageLoading);
