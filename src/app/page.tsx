"use client";

import { useState } from "react";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import HistoryList from "./components/HistoryList";

type Resp = {
  status: number;
  data: any;
  headers: any;
  time: number;
};

export default function Home() {

  const [response, setResponse] = useState<Resp | null>(null);

  // for history items
  const handleResponse = (resp: Resp & { method: string; url: string }) => {
    setResponse(resp);

    // save to history
    const prev = localStorage.getItem("history");
    let arr: any[] = prev ? JSON.parse(prev) : [];

    arr.unshift({
      method: resp.method,
      url: resp.url,
      status: resp.status,
      time: resp.time,
    });
    // keep only last 20
    if (arr.length > 20)
        arr = arr.slice(0, 20);

    localStorage.setItem("history", JSON.stringify(arr));
  }

  const handleHistoryClick = (item: { method: string; url: string; status: number; time: number }) => {
    // refilling form can be done via passing props or using a state lift up etc.
    // For simplicity, maybe show alert or do logic to prefill form
    alert(`You clicked history for ${item.method} ${item.url}`);
  };


  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto space-y-6">
            {/*
            <h1 className="text-2xl font-bold text-center
             text-gray-800 dark:text-gray-200">Postman Lite</h1> */}

            <RequestForm onResponse={handleResponse} />

            {response && <ResponseViewer {...response} />}

            <HistoryList itemClicked={handleHistoryClick} />
        </div>
    </div>
  )
}
