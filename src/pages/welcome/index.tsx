import React from "react"
import { Button, Row, Space, Typography, Upload } from "antd"
import { IssuesHookType } from "../../types"
import { useNavigate } from "react-router-dom"
import { UploadChangeParam } from "antd/es/upload"

export const WelcomePage: React.FC<IssuesHookType> = (issues) => {
    const navigate = useNavigate()
    return(
        <div>
            <Row justify="center" align="middle">
                <Space direction="vertical">
                    <Typography.Title  level={1} style={{ marginBottom: 12 }}>
                        Welcome to Emanager
                    </Typography.Title>
                    <Typography.Title  level={4} style={{ marginBottom: 12 }}>
                        Start
                    </Typography.Title>
                    <Button color="primary" variant="text" onClick={() => {issues.newIssues();navigate('/dashboard')}}>New project</Button>
                    <Upload accept=".xlsx, .xls" onChange={(info: UploadChangeParam) => {issues.loadIssues(info); navigate('/dashboard')}} showUploadList={false}>
                        <Button color="primary" variant="text">Open project</Button>
                    </Upload>
                </Space>
            </Row>
        </div>
    )
}