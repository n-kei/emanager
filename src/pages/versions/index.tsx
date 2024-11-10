import React from 'react';
import { Timeline } from 'antd';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

export const VersionsPage: React.FC = () => (
  <Timeline
    reverse={true}
    items={[
      {
        children: 'Create a services site 2015-09-01',
        dot: <Button type="primary" shape="circle" icon={<RightOutlined />} />
      },
      {
        children: 'Solve initial network problems 2015-09-01',
        dot: <Button type="primary" shape="circle" icon={<RightOutlined />} />
      },
      {
        children: 'Technical testing 2015-09-01',
        dot: <Button type="primary" shape="circle" icon={<RightOutlined />} />
      },
      {
        children: 'Network problems being solved 2015-09-01',
        color: 'red',
      },
    ]}
  />
);