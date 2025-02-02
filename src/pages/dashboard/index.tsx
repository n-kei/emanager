import React from "react"
import { Row, Col, Statistic } from 'antd';
import { Line, Pie } from '@ant-design/plots';
import { IncidentType } from "../../types";
import dayjs from 'dayjs';

export const DashboardPage: React.FC<{incidents: IncidentType[]}> = ({incidents}) => {
    const overdue_tasks = incidents.filter(incident => incident.due_date.isBefore(dayjs())).length;
    const close_deadline_tasks = incidents.filter(incident => incident.due_date.isBefore(dayjs().add(7, 'day'))).length;
    const abandoned_tasks = incidents.filter(incident => incident.progress === 'New' && incident.elapsed_days >= 7).length;

    const count_creattion_date = incidents.reduce((acc, incident) => {
        const date = incident.creation_date.format('YYYY-MM-DD');
        acc[date] = acc[date] ? acc[date] + 1 : 1;
        return acc;
    }, {} as {[key: string]: number});
    const count_error_category = incidents.reduce((acc, incident) => {
        incident.error_category_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});
    const count_error_source = incidents.reduce((acc, incident) => {
        incident.error_source_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});

    const line_config = {
        title: 'incidents per day',
        data: Object.keys(count_creattion_date).map(key => ({day: key, incidents: count_creattion_date[key]})),
        xField: 'day',
        yField: 'incidents',
    };

    const pie_category_config = {
        title: 'error category',
        data: Object.keys(count_error_category).map(key => ({type: key, value: count_error_category[key]})),
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
        data: Object.keys(count_error_source).map(key => ({type: key, value: count_error_source[key]})),
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

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'red' }} title='Overdue tasks' value={overdue_tasks} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'gold' }} title='Tasks with close deadlines' value={close_deadline_tasks} />
                </Col>
                <Col span={8}>
                    <Statistic title='Abandoned tasks' value={abandoned_tasks} />
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