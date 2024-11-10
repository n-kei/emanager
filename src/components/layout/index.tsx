'use client'
import React from 'react';
import { HomeFilled, BugFilled, BranchesOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd'
import { AutoComplete, Input } from 'antd'
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout

const items = [HomeFilled, BugFilled].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: index == 0 ? `Dashboard` : `Incidents`,
    path: index == 0 ? '/' : '/incidents',
  }),
);
export const CommonLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="/" icon={<HomeFilled />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/incidents" icon={<BugFilled />}>
            <Link to="/incidents">Incidents</Link>
          </Menu.Item>
          <Menu.Item key="/versions" icon={<BranchesOutlined />}>
            <Link to="/versions">Versions</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ height: 65, margin: '0vh 1vh 0vh', padding: '0 24px', background: colorBgContainer }}>
          <AutoComplete
            style={{ width: 200 }}
            placeholder="input here"
          />
        </Header>

        <Content style={{ margin: '2vh 1vh 2vh' }}>
          <div
            style={{
              height: '100%',
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
          </div>
        </Content>
      </Layout>
    </Layout>
  );

}