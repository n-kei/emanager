import React from "react"
import { Row, Col, Statistic } from 'antd';
import { DatePicker } from 'antd';
import { Line, Pie } from '@ant-design/plots';
import { IssueType } from "../../types";
import dayjs, { Dayjs } from 'dayjs';
import { Typography } from 'antd';

const { Title } = Typography;

export const DashboardPage: React.FC<{issues: IssueType[]}> = ({issues}) => {
    const overdue_tasks = issues.filter(issue => issue.due_date.isBefore(dayjs())).length;
    const close_deadline_tasks = issues.filter(Issue => Issue.due_date.isBefore(dayjs().add(7, 'day')) && Issue.due_date.isAfter(dayjs())).length;
    const abandoned_tasks = issues.filter(Issue => Issue.progress === 'New' && Issue.elapsed_days >= 7).length;

    const [start_date, set_start_date] = React.useState<Dayjs>(dayjs());
    const [end_date, set_end_date] = React.useState<Dayjs>(dayjs());
    const handleDateChange = (dates: any) => {
        if (dates) {
            set_start_date(dates[0]);
            set_end_date(dates[1]);
        }
    };

    const count_creattion_date = issues.reduce((acc, issue) => {
        const date = issue.outage_date.format('YYYY-MM-DD');
        acc[date] = acc[date] ? acc[date] + 1 : 1;
        return acc;
    }, {} as {[key: string]: number});
    const count_error_category = issues.reduce((acc, Issue) => {
        Issue.error_category_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});
    const count_error_source = issues.reduce((acc, Issue) => {
        Issue.error_source_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});

    const line_config = {
        title: 'Burndown chart',
        data: Object.keys(count_creattion_date).filter(
            key => dayjs(key).isAfter(start_date) && dayjs(key).isBefore(end_date) || key === start_date.format('YYYY-MM-DD') || key === end_date.format('YYYY-MM-DD')
        ).map(key => ({day: key, issues: count_creattion_date[key]})),
        xField: 'day',
        yField: 'issues',
    };

    const pie_category_config = {
        title: 'Error category',
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
        title: 'Error source',
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
                    <Title level={4}>Burndown period</Title>
                </Col>
                <DatePicker.RangePicker
                    defaultValue={[start_date, end_date]}
                    onChange={handleDateChange}
                />
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