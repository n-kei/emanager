import { useState } from 'react';
import { deleteIssueType, IssueType, PriorityTypeEnum, ProgressTypeEnum } from './types';
import { addIssueType, editIssueType } from './types';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { UploadChangeParam } from 'antd/es/upload';

const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      resolve(jsonData);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const useIssues = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);

  const addIssue: addIssueType = (Issue: IssueType) => {
    setIssues([...issues, Issue]);
  }

  const editIssue: editIssueType = (key: string, issue: IssueType) => {
    setIssues(issues.map(i => i.key === key ? issue : i));
  }

  const deleteIssue: deleteIssueType = (key: string) => {
    setIssues(issues.filter(i => i.key !== key));
  }

  const loadIssues = (info: UploadChangeParam) => {
    // TODO: remaining_daysの計算を追加する
    // TODO: elapsed_daysの計算を追加する
    /* ここにExcelからデータを吸い出してjsonの配列にまとめる処理を書く */
    /* 以下は動作確認用のダミーデータ */
    //if(info.file.status === 'done') {
    //  readExcelFile(info.file.originFileObj as File).then((data) => {
    //    console.log(data);
    //    /* ここにExcelから読み込んだデータをjsonの配列にまとめる処理を書く */
    //    // setIssues(data);
    //  }
    //  ).catch((error) => {
    //    console.error(error);
    //  });
    //}

    setIssues([
      {
          key: '1',
          title: 'BIOSエラー',
          creation_date: dayjs('2025-01-01'),
          abstract: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          statement: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          workaround: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          solution: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          comments: [
            {date: dayjs('2025-01-01'), comment: 'BIOSエラー発生'}, 
            {date: dayjs('2025-01-02'), comment: 'BIOSエラー解消'}
          ],

          progress: ProgressTypeEnum.New,
          priority: PriorityTypeEnum.Middle,
          system_tags: ['PRIMERGY_v1.0', 'PRIMERGY_v2.0'],
          error_source_tags: ['pcie.c', 'nvme.c'],
          error_category_tags: ['PCIe', 'NVMe'],
          ticket_id: '000000000',
          ticket_link: 'https://www.google.com',
          due_date: dayjs('2025-01-01'),
          elapsed_days: 30,
          remaining_days: 6,
      },
      {
          key: '2',
          title: 'FWエラー',
          creation_date: dayjs('2025-01-10'),
          abstract: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          statement: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          workaround: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          solution: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          comments: [
            {date: dayjs('2025-01-01'), comment: 'BIOSエラー発生'}, 
            {date: dayjs('2025-01-02'), comment: 'BIOSエラー解消'}
          ],

          progress: ProgressTypeEnum.New,
          priority: PriorityTypeEnum.Middle,
          system_tags: ['PRIMERGY_v2.0', 'PRIMERGY_v3.0'],
          error_source_tags: ['pcie.c', 'nvme.c', 'fw.c'],
          error_category_tags: ['PCIe', 'NVMe'],
          ticket_id: '000000000',
          ticket_link: 'https://www.google.com',
          due_date: dayjs('2025-01-01'),
          elapsed_days: 30,
          remaining_days: 6,
      }
    ])
  }

  const saveIssues = () => {
    /* ここにjsonの配列をExcelに書き出す処理を書く */
    const system_tags = Array.from(new Set(issues.flatMap(issue => issue.system_tags).map(tag => "system:" + tag)));
    const error_source_tags = Array.from(new Set(issues.flatMap(issue => issue.error_source_tags).map(tag => "error_source:" + tag)));
    const error_category_tags = Array.from(new Set(issues.flatMap(issue => issue.error_category_tags).map(tag => "error_category:" + tag)));

    const data = [
      //TODO: Interfaceのkey定義と内容を同期させる
      ["Key", "Title", "Creation Date", "Abstract", "Statement", "Workaround", "Solution", "Progress", "Priority", "Ticket ID", "Ticket Link", "Due Date", "Elapsed Days", "Remaining Days", "Memo sheet", ...system_tags, ...error_source_tags, ...error_category_tags],
      ...issues.map(issue => [
        issue.key,
        issue.title,
        issue.creation_date.format('YYYY/MM/DD'),
        issue.abstract,
        issue.statement,
        issue.workaround,
        issue.solution,
        issue.progress,
        issue.priority,
        issue.ticket_id,
        issue.ticket_link,
        issue.due_date.format('YYYY/MM/DD'),
        issue.elapsed_days,
        issue.remaining_days,
        "link",
        ...system_tags.map(tag => issue.system_tags.includes(tag.replace("system:", "")) ? "O" : ""),
        ...error_source_tags.map(tag => issue.error_source_tags.includes(tag.replace("error_source:", "")) ? "O" : ""),
        ...error_category_tags.map(tag => issue.error_category_tags.includes(tag.replace("error_category:", "")) ? "O" : ""),
      ])
    ]
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'issues');

    issues.forEach((issue, index) => {
      const row_number = index + 2; // 1-based index for XLSX
      const sheet_name = `${issue.key}_${issue.title}`;
      const mws = XLSX.utils.aoa_to_sheet([["Back to issues"]]);
      

      mws["A1"].l = {Target: `#issues!A1`};
      XLSX.utils.book_append_sheet(wb, mws, sheet_name);
      ws["O" + row_number].l = {Target: `#${sheet_name}!A1`, Tooltip: `To ${sheet_name}`};

      if(!ws["A" + row_number].c) {
        ws["A" + row_number].c = [];
      }
      issue.comments.forEach((comment, _) => {
        ws["A" + row_number].c.push({a: `Admin ${comment.date.format('YYYY/MM/DD')}`, t: comment.comment, T: true});
      }) 
    })
    XLSX.writeFile(wb, 'download.xlsx');
  }

  return [issues, {addIssue, editIssue, deleteIssue, loadIssues, saveIssues}] as const;

}