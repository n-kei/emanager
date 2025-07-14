'use client'
import React from 'react';
import { HomeFilled, BugFilled, SaveFilled, ImportOutlined, WarningFilled, CheckSquareFilled, ReadOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd'
import {Space} from 'antd'
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Upload } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';
import {Drawer} from 'antd'
import { SheetsHookType } from '../../types';

const { Header, Content,  Sider } = Layout

export const CommonLayout: React.FC<SheetsHookType> = (sheets) => {
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [open, setOpen] = React.useState(false);

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
          <Menu.Item key="/dashboard" icon={<HomeFilled />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/specs" icon={<ReadOutlined />}>
            <Link to="/specs">Specs</Link>
          </Menu.Item>
          <Menu.Item key="/issues" icon={<BugFilled />}>
            <Link to="/issues">Issues</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ height: 65, margin: '0vh 1vh 0vh', padding: '0 24px', background: colorBgContainer }}>
          <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space direction="horizontal">
              <Upload accept=".xlsx, .xls" onChange={(info: UploadChangeParam) => {sheets.loadSheets(info); navigate('/dashboard')}} showUploadList={false}>
                <Button icon={<ImportOutlined/>}/>
              </Upload>
              <Button icon={<SaveFilled/>} onClick={sheets.saveSheets}/>
              {/* TODO: 整合性チェック機能を実装する */}
              <Button icon={<CheckSquareFilled/>}/>
            </Space>
              {/* TODO: 整合性チェック結果表示機能を実装する(不整合時は赤く点灯するようにする) */}
            <Button icon={<WarningFilled/>} style={{border: 'none'}} onClick={() => {setOpen(true)}}/>
            <Drawer onClose={() => {setOpen(false)}} open={open}>
              No error
            </Drawer>
          </Space>
        </Header>

        <Content style={{ margin: '2vh 1vh 2vh' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
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