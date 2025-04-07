import React from "react"
import { Button, Descriptions, Row, Space, Typography, Upload } from "antd"
import { loadIssuesType, newIssuesType } from "../../types"
import { useNavigate } from "react-router-dom"
import { UploadChangeParam } from "antd/es/upload"

export const WelcomePage: React.FC<{loadIssues: loadIssuesType, newIssues: newIssuesType}> = ({loadIssues, newIssues}) => {
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
                    <Button color="primary" variant="text" onClick={() => {newIssues();navigate('/dashboard')}}>New project</Button>
                    <Upload accept=".xlsx, .xls" onChange={(info: UploadChangeParam) => {loadIssues(info); navigate('/dashboard')}} showUploadList={false}>
                        <Button color="primary" variant="text">Open project</Button>
                    </Upload>
                </Space>
            </Row>
        </div>
    )
}