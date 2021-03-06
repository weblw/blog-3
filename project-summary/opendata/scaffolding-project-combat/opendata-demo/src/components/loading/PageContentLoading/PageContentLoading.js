/*
 * @(#) PageContentLoading.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-18 15:59:52
 */

import styles from './PageContentLoading.scss';
import { Spin } from 'antd';
import React from 'react';

const PageContentLoading = () => (
    <div className={styles.pageContentLoading}>
        <Spin size="large" />
    </div>
);

export default PageContentLoading;
