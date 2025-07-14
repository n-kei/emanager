import { UploadChangeParam } from 'antd/es/upload'
import { Dayjs } from 'dayjs'

export enum ProgressTypeEnum {
    New = 'New',   
    InProgress = 'In Progress',
    Resolved = 'Resolved',
    Closed = 'Closed'
}

export enum PriorityTypeEnum {
    High = 'High',
    Middle = 'Middle',
    Low = 'Low'
}

export interface IssueType {
    key: string
    title: string
    outage_date: Dayjs
    abstract: string
    statement: string
    workaround: string
    solution: string
    comments: { date: Dayjs, comment: string }[]

    progress: ProgressTypeEnum
    priority: PriorityTypeEnum
    system_tags: string[]
    error_source_tags: string[]
    error_category_tags: string[]
    ticket_id: string
    ticket_link: string
    due_date: Dayjs
    elapsed_days: number
    remaining_days: number
    creation_date: Dayjs
    closed_date: Dayjs | null
}

export interface SpecType {
    key: string
    title: string
    outage_date: Dayjs
    abstract: string
    statement: string
    workaround: string
    solution: string
    comments: { date: Dayjs, comment: string }[]

    progress: ProgressTypeEnum
    priority: PriorityTypeEnum
    system_tags: string[]
    ticket_id: string
    ticket_link: string
    due_date: Dayjs
    elapsed_days: number
    remaining_days: number
    creation_date: Dayjs
    closed_date: Dayjs | null
}

export type addIssueType = (Issue: IssueType) => void
export type addEmptyIssueType = () => string
export type editIssueType = (key: string, Issue: IssueType) => void
export type deleteIssueType = (key: string) => void
export type newIssuesType = () => void
export type saveIssuesType = () => void
export type loadIssuesType = (info: UploadChangeParam) => void

export interface IssuesHookType {
    issues: IssueType[]
    addIssue: addIssueType
    addEmptyIssue: addEmptyIssueType
    editIssue: editIssueType
    deleteIssue: deleteIssueType
    newIssues: newIssuesType
    loadIssues: loadIssuesType
    saveIssues: saveIssuesType
}

export interface SpecsHookType {
    issues: IssueType[]
    addIssue: addIssueType
    addEmptyIssue: addEmptyIssueType
    editIssue: editIssueType
    deleteIssue: deleteIssueType
    newIssues: newIssuesType
    loadIssues: loadIssuesType
    saveIssues: saveIssuesType
}

export interface TableHookType<T> {
    items: T[]
    setItems: (items: any[]) => void
    addItem: (item: any) => void
    addEmptyItem: () => string
    editItem: (key: string, item: any) => void
    deleteItem: (key: string) => void
    refineLoadItems: (data: any[]) => any[]
    exportItems: () => any[]
}

export interface Sheets {
    [sheetName: string]: TableHookType<any>
}

export interface SheetsHookType {
    loadSheets: (info: UploadChangeParam) => void
    saveSheets: () => void
}