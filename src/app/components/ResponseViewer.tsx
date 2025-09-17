"use client";

import prettyBytes from 'pretty-bytes';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface Props {
  status: number;
  data: any;
  headers: any;
  time: number;
}

export default function ResponseViewer({ status, data, headers, time }: Props) {

  const totalBytes = prettyBytes(
    (data ? JSON.stringify(data).length : 0) +
    (headers ? JSON.stringify(headers).length : 0)
  );

  return (
    <div className="p-4 border rounded mt-4 space-y-2 bg-gray-50 dark:bg-gray-800">

      <h1 className="text-xl font-bold">Response</h1>
      <hr></hr>

      <div>
        <strong>Status:</strong> {status} {'- '}
        <strong>Time:</strong> {time} ms {'- '}
        <strong>Size:</strong> {totalBytes}
      </div>

      <div className='py-2'>
        <strong>Response Headers:</strong>
        <JsonView data={headers ?? {}} shouldExpandNode={allExpanded} style={defaultStyles} />
      </div>

      <div>
        <strong>Response Body:</strong>
        <JsonView data={data ?? {}} shouldExpandNode={allExpanded} style={defaultStyles} />
      </div>
    </div>
  )
}
