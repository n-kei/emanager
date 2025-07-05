import { useState } from 'react';
import { addEmptyIssueType, deleteIssueType, IssueType, PriorityTypeEnum, ProgressTypeEnum } from './types';
import { addIssueType, editIssueType } from './types';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { UploadChangeParam } from 'antd/es/upload';
import { IssuesHookType } from './types';

const readExcelFile = (file: File): Promise<IssueType[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      resolve(refineExcelData(jsonData));
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// TODO: Mysterious Name
const refineExcelData = (data: any[]): IssueType[] => { 
  return data.map((item) => ({
    key: item.Key,
    title: item.Title,
    outage_date: dayjs(item['Outage date']),
    abstract: item.Abstract,
    statement: item.Statement,
    workaround: item.Workaround,
    solution: item.Solution,
    comments: item.Comments.split('\n').map((comment: string) => {
      const [date, text] = comment.split(': ');
      return { date: dayjs(date), comment: text };
    }),
    progress: item.Progress,
    priority: item.Priority,
    system_tags: Object.keys(item).filter((key) => key.startsWith('system:') && item[key] === 'O').map((key) => key.replace('system:', '')),
    error_source_tags: Object.keys(item).filter((key) => key.startsWith('error_source:') && item[key] === 'O').map((key) => key.replace('error_source:', '')),
    error_category_tags: Object.keys(item).filter((key) => key.startsWith('error_category:') && item[key] === 'O').map((key) => key.replace('error_category:', '')),
    ticket_id: item['Ticket ID'],
    ticket_link: item['Ticket link'],
    due_date: dayjs(item['Due date']),
    elapsed_days: dayjs().diff(dayjs(item['Outage date']), 'day'),
    remaining_days: dayjs(item['Due date']).diff(dayjs(), 'day') + 1,
    creation_date: dayjs(item['Creation date']),
    closed_date: item['Closed date'] === "Not closed yet" ? null : dayjs(item['Closed date']),
  }));
}

export const useIssues = (): IssuesHookType => {
  const [issues, setIssues] = useState<IssueType[]>([]);

  const addIssue: addIssueType = (Issue: IssueType) => {
    setIssues([...issues, Issue]);
  }

  const addEmptyIssue: addEmptyIssueType = () => {
    const newIssue: IssueType = {
      key: (issues.length + 1).toString(),
      title: "New",
      outage_date: dayjs(),
      abstract: "",
      statement: "",
      workaround: "",
      solution: "",
      comments: [
        {date: dayjs(), comment: 'Created'}
      ],
      progress: ProgressTypeEnum.New,
      priority: PriorityTypeEnum.Middle,
      system_tags: [],
      error_source_tags: [],
      error_category_tags: [],
      ticket_id: "",
      ticket_link: "",
      due_date: dayjs(),
      elapsed_days: 0,
      remaining_days: 0,
      creation_date: dayjs(),
      closed_date: null
    };
    setIssues([...issues, newIssue]);

    return newIssue.key;
  }

  const editIssue: editIssueType = (key: string, issue: IssueType) => {
    setIssues(issues.map(i => i.key === key ? issue : i));
  }

  const deleteIssue: deleteIssueType = (key: string) => {
    setIssues(issues.filter(i => i.key !== key));
  }

  const newIssues = () => {
    setIssues([])
  }

  const loadIssues = (info: UploadChangeParam) => {
    /* ここにExcelからデータを吸い出してjsonの配列にまとめる処理を書く */
    readExcelFile(info.file.originFileObj as File).then((data: IssueType[]) => {
      setIssues(data)
    })
  }

  const saveIssues = () => {
    /* ここにjsonの配列をExcelに書き出す処理を書く */
    const system_tags = Array.from(new Set(issues.flatMap(issue => issue.system_tags).map(tag => "system:" + tag)));
    const error_source_tags = Array.from(new Set(issues.flatMap(issue => issue.error_source_tags).map(tag => "error_source:" + tag)));
    const error_category_tags = Array.from(new Set(issues.flatMap(issue => issue.error_category_tags).map(tag => "error_category:" + tag)));

    // TODO: Primitive Obsession
    // TODO: Data Clumps
    const data = [
      ...issues.map(issue => ({
          "Key": issue.key,
          "Title": issue.title,
          "Outage date": issue.outage_date.format('YYYY/MM/DD'),
          "Abstract": issue.abstract,
          "Statement": issue.statement,
          "Workaround": issue.workaround,
          "Solution": issue.solution,
          "Comments": issue.comments.map(comment => comment.date.format('YYYY/MM/DD') + ": " + comment.comment).join("\n"),
          "Progress": issue.progress,
          "Priority": issue.priority,
          "Ticket ID": issue.ticket_id,
          "Ticket link": issue.ticket_link,
          "Due date": issue.due_date.format('YYYY/MM/DD'),
          "Elapsed days": issue.elapsed_days,
          "Remaining days": issue.remaining_days,
          "Creation date": issue.creation_date.format('YYYY/MM/DD'),
          "Closed date": issue.closed_date === null ? "Not closed yet" : issue.closed_date.format('YYYY/MM/DD'),
          ...system_tags.map(tag => ({[tag]: issue.system_tags.includes(tag.replace("system:", "")) ? "O" : ""})).reduce((acc, curr) => ({ ...acc, ...curr }), {}),  
          ...error_source_tags.map(tag => ({[tag]: issue.error_source_tags.includes(tag.replace("error_source:", "")) ? "O" : ""})).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          ...error_category_tags.map(tag => ({[tag]: issue.error_category_tags.includes(tag.replace("error_category:", "")) ? "O" : ""})).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        })
      ),
    ]

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'issues');
    XLSX.writeFile(wb, `emanager_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
  }

  return {issues, addIssue, addEmptyIssue, editIssue, deleteIssue, newIssues, loadIssues, saveIssues} as IssuesHookType;

}