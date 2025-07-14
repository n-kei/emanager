import { useState } from 'react';
import { addIssueType, editIssueType } from './types';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { UploadChangeParam } from 'antd/es/upload';
import { addEmptyIssueType, deleteIssueType, SpecType, IssueType, PriorityTypeEnum, ProgressTypeEnum } from './types';
import { SheetsHookType, TableHookType, Sheets } from './types';

export const useSheets = (sheets : Sheets): SheetsHookType => {
  const readExcelFile = (file: File): Promise<{[sheetName: string] : any[]}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        //const jsonData = workbook.SheetNames.map((sheetName) => 
        //  {[sheetName]: tables[sheetName].refineLoadData(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]))}
        //)
        const jsonData = workbook.SheetNames.reduce<Record<string, any[]>>((acc, sheetName) => {
          acc[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
          return acc;
        }, {})
        resolve(jsonData)
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const loadSheets = (info: UploadChangeParam) => {
    /* ここにExcelからデータを吸い出してjsonの配列にまとめる処理を書く */
    readExcelFile(info.file.originFileObj as File).then((jsonData) => {
      Object.entries(jsonData).forEach(([sheetName, items]) => {
        sheets[sheetName].setItems(sheets[sheetName].refineLoadItems(items))
      })
    })
  }

  const saveSheets = () => {
    const wb = XLSX.utils.book_new();
    Object.entries(sheets).forEach(([sheetName, table]) => {
      const ws = XLSX.utils.json_to_sheet(table.items);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    })
    XLSX.writeFile(wb, `emanager_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
  }

  return {loadSheets, saveSheets}
}

export const useSpecs = (): TableHookType<SpecType> => {
  const [items, setItems] = useState<SpecType[]>([]);

  const addItem = (spec: SpecType) => {
    setItems([...items, spec]);
  }

  const addEmptyItem = () => {
    const new_spec: SpecType = {
      key: (items.length + 1).toString(),
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
      ticket_id: "",
      ticket_link: "",
      due_date: dayjs(),
      elapsed_days: 0,
      remaining_days: 0,
      creation_date: dayjs(),
      closed_date: null
    };
    setItems([...items, new_spec]);

    return new_spec.key;
  }

  const editItem = (key: string, issue: SpecType) => {
    setItems(items.map(i => i.key === key ? issue : i));
  }

  const deleteItem = (key: string) => {
    setItems(items.filter(i => i.key !== key));
  }

  const refineLoadItems = (data: any[]): SpecType[] => { 
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
      ticket_id: item['Ticket ID'],
      ticket_link: item['Ticket link'],
      due_date: dayjs(item['Due date']),
      elapsed_days: dayjs().diff(dayjs(item['Outage date']), 'day'),
      remaining_days: dayjs(item['Due date']).diff(dayjs(), 'day') + 1,
      creation_date: dayjs(item['Creation date']),
      closed_date: item['Closed date'] === "Not closed yet" ? null : dayjs(item['Closed date']),
    }));
  }
  const exportItems = () => {
    /* ここにjsonの配列をExcelに書き出す処理を書く */
    const system_tags = Array.from(new Set(items.flatMap(issue => issue.system_tags).map(tag => "system:" + tag)));

    // TODO: Primitive Obsession
    // TODO: Data Clumps
    return [
      ...items.map(issue => ({
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
        })
      ),
    ]
  }

  return {items, setItems, addItem, addEmptyItem, editItem, deleteItem, refineLoadItems, exportItems};
}

export const useIssues = (): TableHookType<IssueType> => {
  const [items, setItems] = useState<IssueType[]>([]);

  const addItem: addIssueType = (Issue: IssueType) => {
    setItems([...items, Issue]);
  }

  const addEmptyItem: addEmptyIssueType = () => {
    const newIssue: IssueType = {
      key: (items.length + 1).toString(),
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
    setItems([...items, newIssue]);

    return newIssue.key;
  }

  const editItem: editIssueType = (key: string, issue: IssueType) => {
    setItems(items.map(i => i.key === key ? issue : i));
  }

  const deleteItem: deleteIssueType = (key: string) => {
    setItems(items.filter(i => i.key !== key));
  }

  const refineLoadItems = (data: any[]): IssueType[] => { 
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

  const exportItems = () => {
    /* ここにjsonの配列をExcelに書き出す処理を書く */
    const system_tags = Array.from(new Set(items.flatMap(issue => issue.system_tags).map(tag => "system:" + tag)));
    const error_source_tags = Array.from(new Set(items.flatMap(issue => issue.error_source_tags).map(tag => "error_source:" + tag)));
    const error_category_tags = Array.from(new Set(items.flatMap(issue => issue.error_category_tags).map(tag => "error_category:" + tag)));

    // TODO: Primitive Obsession
    // TODO: Data Clumps
    return [
      ...items.map(issue => ({
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
  }

  return {items, setItems, addItem, addEmptyItem, editItem, deleteItem, refineLoadItems, exportItems};
}