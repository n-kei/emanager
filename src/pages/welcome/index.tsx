import React from "react"
import { Button, Row, Space, Typography, Upload } from "antd"
import { SheetsHookType, TableHookType } from "../../types"
import { useNavigate } from "react-router-dom"
import { UploadChangeParam } from "antd/es/upload"

export const WelcomePage: React.FC<{sheets: SheetsHookType, tables: TableHookType<any>[]}> = ({sheets, tables}) => {
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
                    <Button color="primary" variant="text" onClick={() => {tables.forEach((table) => table.setItems([]));navigate('/dashboard')}}>New project</Button>
                    <Upload accept=".xlsx, .xls" onChange={(info: UploadChangeParam) => {sheets.loadSheets(info); navigate('/dashboard')}} showUploadList={false}>
                        <Button color="primary" variant="text">Open project</Button>
                    </Upload>
                </Space>
            </Row>
        </div>
    )
}