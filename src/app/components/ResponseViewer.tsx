"use client";

import prettyBytes from 'pretty-bytes';
import dynamic from "next/dynamic";
import { useState } from 'react';
const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

interface Props {
  status: number;
  data: any;
  headers: any;
  time: number;
}

export default function ResponseViewer({ status, data, headers, time }: Props) {

  let totalBytes = prettyBytes(
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

      <div>
        <strong>Response Headers:</strong>
        <ReactJson src={headers ?? {}} name={false} collapsed={true} />
      </div>

      <div>
        <strong>Response Body:</strong>
        <ReactJson src={data} name={false} collapsed={false} />
      </div>
    </div>
  )
}
