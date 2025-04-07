'use client'
import React from 'react';
import { HomeFilled, BugFilled, BranchesOutlined, SaveFilled, SaveOutlined, ImportOutlined, WarningFilled, CheckSquareFilled } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd'
import {Space} from 'antd'
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IssueType, loadIssuesType, saveIssuesType } from '../../types';
import { Upload } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';
import {Drawer} from 'antd'

const { Header, Content, Footer, Sider } = Layout

export const CommonLayout: React.FC<{issues: IssueType[], loadIssues: loadIssuesType, saveIssues: saveIssuesType}> = ({issues, loadIssues, saveIssues}) => {
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
          <Menu.Item key="/issues" icon={<BugFilled />}>
            <Link to="/issues">Issues</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ height: 65, margin: '0vh 1vh 0vh', padding: '0 24px', background: colorBgContainer }}>
          <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space direction="horizontal">
              <Upload accept=".xlsx, .xls" onChange={(info: UploadChangeParam) => {loadIssues(info); navigate('/dashboard')}} showUploadList={false}>
                <Button icon={<ImportOutlined/>}/>
              </Upload>
              <Button icon={<SaveFilled/>} onClick={saveIssues}/>
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
//'use client'
//import React from 'react';
//import { HomeFilled, BugFilled, BranchesOutlined, SaveFilled, SaveOutlined } from '@ant-design/icons';
//import { Button, Layout, Menu, theme } from 'antd'
//import { Outlet } from 'react-router-dom';
//import { Link } from 'react-router-dom';
//import { saveissues } from '../../hooks';
//import { IssueType } from '../../types';
//import { useState } from 'react';
//import * as XLSX from 'xlsx';
//
//const { Header, Content, Footer, Sider } = Layout
//
//const items = [HomeFilled, BugFilled].map(
//  (icon, index) => ({
//    key: String(index + 1),
//    icon: React.createElement(icon),
//    label: index == 0 ? `Dashboard` : `issues`,
//    path: index == 0 ? '/' : '/issues',
//  }),
//);
//
//export const CommonLayout: React.FC<{issues: IssueType[]}> = ({issues}) => {
//  const [file1, setFile1] = useState<File | null>(null);
//  const [file2, setFile2] = useState<File | null>(null);
//  const [diff, setDiff] = useState<any[]>([]);
//
//  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileIndex: 1 | 2) => {
//    const file = e.target.files ? e.target.files[0] : null;
//    if (file) {
//      if (fileIndex === 1) {
//        setFile1(file);
//      } else {
//        setFile2(file);
//      }
//    }
//  };
//
//  const readExcelFile = (file: File): Promise<any[]> => {
//    return new Promise((resolve, reject) => {
//      const reader = new FileReader();
//      reader.onload = (e) => {
//        const data = new Uint8Array(e.target!.result as ArrayBuffer);
//        const workbook = XLSX.read(data, { type: 'array' });
//        const sheetName = workbook.SheetNames[0];
//        const sheet = workbook.Sheets[sheetName];
//        const jsonData = XLSX.utils.sheet_to_json(sheet);
//        resolve(jsonData);
//      };
//      reader.onerror = (error) => reject(error);
//      reader.readAsArrayBuffer(file);
//    });
//  };
//
//  const compareExcelFiles = async () => {
//    if (!file1 || !file2) {
//      alert('Select both excel file!');
//      return;
//    }
//
//    try {
//      const data1 = await readExcelFile(file1);
//      const data2 = await readExcelFile(file2);
//      console.error(data1);
//      console.error(data2);
//
//      const diffResult = findDifferences(data1, data2);
//      setDiff(diffResult);
//    } catch (error) {
//      alert('Failed to read excel file!');
//      console.error(error);
//    }
//  };
//
//  const findDifferences = (data1: any[], data2: any[]) => {
//    const diffArray: any[] = [];
//    const maxLength = Math.max(data1.length, data2.length);
//
//    for (let i = 0; i < maxLength; i++) {
//      if (JSON.stringify(data1[i]) !== JSON.stringify(data2[i])) {
//        diffArray.push({
//          index: i,
//          file1: data1[i],
//          file2: data2[i],
//        });
//      }
//    }
//
//    return diffArray;
//  };
//  const {
//    token: { colorBgContainer, borderRadiusLG },
//  } = theme.useToken();
//
//  return (
//    <Layout style={{ minHeight: '100vh' }}>
//      <Sider
//        breakpoint="lg"
//        collapsedWidth="0"
//        onBreakpoint={(broken) => {
//          console.log(broken);
//        }}
//        onCollapse={(collapsed, type) => {
//          console.log(collapsed, type);
//        }}
//      >
//        <div className="demo-logo-vertical" />
//        <Menu theme="dark" mode="inline">
//          <Menu.Item key="/" icon={<HomeFilled />}>
//            <Link to="/">Dashboard</Link>
//          </Menu.Item>
//          <Menu.Item key="/issues" icon={<BugFilled />}>
//            <Link to="/issues">issues</Link>
//          </Menu.Item>
//          <Menu.Item key="/versions" icon={<BranchesOutlined />}>
//            <Link to="/versions">Versions</Link>
//          </Menu.Item>
//        </Menu>
//      </Sider>
//      <Layout>
//        <Header style={{ height: 65, margin: '0vh 1vh 0vh', padding: '0 24px', background: colorBgContainer }}>
//          <Button icon={<SaveFilled/>} onClick={() => {saveissues(issues)}}/>
//        </Header>
//
//        <Content style={{ margin: '2vh 1vh 2vh' }}>
//          <div
//            style={{
//              height: '100%',
//              padding: 24,
//              minHeight: 360,
//              background: colorBgContainer,
//              borderRadius: borderRadiusLG,
//            }}
//          >
//            <Outlet/>
//            <div>
//              <h1>Compare Excel File</h1>
//              <div>
//                <label>
//                  <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e, 1)} />
//                </label>
//              </div>
//              <div>
//                <label>
//                  <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e, 2)} />
//                </label>
//              </div>
//              <button onClick={compareExcelFiles}>Compare</button>
//
//              <div>
//                <h2>Result:</h2>
//                {diff.length === 0 && <p>No Diff</p>}
//                {diff.length > 0 && (
//                  <ul>
//                    {diff.map((item, index) => (
//                      <li key={index}>
//                        <p>Line {item.index + 1} :</p>
//                        <pre>File 1: {JSON.stringify(item.file1, null, 2)}</pre>
//                        <pre>File 2: {JSON.stringify(item.file2, null, 2)}</pre>
//                      </li>
//                    ))}
//                  </ul>
//                )}
//              </div>
//            </div>
//          </div>
//        </Content>
//      </Layout>
//    </Layout>
//  );
//
//}