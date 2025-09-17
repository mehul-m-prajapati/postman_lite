"use client";

import React, { useEffect, useState } from 'react'

type HistoryItem = {
  method: string;
  url: string;
  time: number;
  status: number;
};

interface Props {
  itemClicked: (item: HistoryItem) => void;
}

function HistoryList({ itemClicked }: Props) {

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const h = localStorage.getItem("history");
    if (h)
        setHistory(JSON.parse(h));
  }, []);

  const handleClick = (item: HistoryItem) => {
    itemClicked(item);
  };

  return (
    <div className="p-4 border rounded mt-4 h-64 overflow-y-auto bg-white dark:bg-gray-900">
      <h3 className="font-bold mb-2">History</h3>

      {history.length === 0 && <div>No history yet</div>}

      {history.map((item, idx) => (
        <div
          key={idx}
          className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          onClick={() => handleClick(item)}
        >
          <span className="font-mono">{item.method}</span> – {item.url}
          <span className="text-sm text-gray-500">({item.status}, {item.time}ms)</span>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
