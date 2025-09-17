"use client";

import ReactJson from "react-json-view";

interface Props {
  status: number;
  data: any;
  headers: any;
  time: number;
}

export default function ResponseViewer({ status, data, headers, time }: Props) {

    console.log("---------------------------")
  console.log(status, data, headers, time);

  return (
    <div className="p-4 border rounded mt-4 space-y-2 bg-gray-50 dark:bg-gray-800">
      <div>
        <strong>Status:</strong> {status} — <strong>Time:</strong> {time} ms
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
