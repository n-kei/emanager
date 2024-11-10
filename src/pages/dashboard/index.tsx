import React from "react"
import { Row, Col, Statistic } from 'antd';
import { Line, Pie } from '@ant-design/plots';

const line_config = {
    title: 'incidents per day',
    data: [
        {day: '4/1', incidents: 3},
        {day: '4/2', incidents: 4},
        {day: '4/3', incidents: 3.5},
        {day: '4/4', incidents: 5},
        {day: '4/5', incidents: 4.9},
        {day: '4/6', incidents: 6},
        {day: '4/7', incidents: 7},
        {day: '4/8', incidents: 9},
        {day: '4/9', incidents: 13},
    ],
    xField: 'day',
    yField: 'incidents',
};

const pie_category_config = {
    title: 'error category',
    data: [
        { type: 'PCIe', value: 27 },
        { type: 'I2C', value: 25 },
        { type: 'Display', value: 18 },
        { type: 'I3C', value: 15 },
        { type: 'Serdes', value: 10 },
        { type: 'Other', value: 5 },
    ],
    angleField: 'value',
    colorField: 'type',
    label: {
        text: 'value',
        style: {
            fontWeight: 'bold',
        },
    },
    legend: {
        color: {
            title: false,
            position: 'right',
            rowPadding: 5,
        },
    },
};

const pie_source_config = {
    title: 'error source',
    data: [
        { type: 'xxx.c', value: 27 },
        { type: 'yyy.c', value: 25 },
        { type: 'hoge.c', value: 18 },
        { type: 'huga.c', value: 15 },
        { type: 'piyo.c', value: 10 },
        { type: 'Other', value: 5 },
    ],
    angleField: 'value',
    colorField: 'type',
    label: {
        text: 'value',
        style: {
            fontWeight: 'bold',
        },
    },
    legend: {
        color: {
            title: false,
            position: 'right',
            rowPadding: 5,
        },
    },
};


export const DashboardPage: React.FC = () => {
    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'red' }} title='Overdue tasks' value={50} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'gold' }} title='Tasks with close deadlines' value={100} />
                </Col>
                <Col span={8}>
                    <Statistic title='Abandoned tasks' value={200} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Line {...line_config} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Pie {...pie_category_config} />
                </Col>
                <Col span={12}>
                    <Pie {...pie_source_config} />
                </Col>
            </Row>
        </div>
    )
}