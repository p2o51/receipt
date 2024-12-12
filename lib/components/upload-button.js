"use client";
import { useState } from 'react';

// Move getValue function outside of handleUpload
const getValue = (obj, key) => {
  const lowerKey = key.toLowerCase();
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
  return foundKey ? obj[foundKey] : '-';
};

export default function UploadButton() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setTableData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      console.log('API 返回数据：', data);
      
      // 解析返回的结果中的 JSON 字符串
      const resultText = data.result;
      const jsonMatch = resultText.match(/```json\s*(\[[\s\S]*?\])\s*```/);
      
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[1]);
        setTableData(jsonData);
      } else {
        throw new Error('未找到有效的数据格式');
      }
    } catch (error) {
      console.error('错误详情：', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <input 
        type="file" 
        onChange={(e) => {
          setFile(e.target.files[0]);
          setError(null);
          setTableData(null);
        }} 
        accept="image/*"
        className="file-input file-input-bordered w-full max-w-xs"
      />
      <button 
        onClick={handleUpload}
        disabled={!file || loading}
        className={`btn ${!file || loading ? 'btn-disabled' : 'btn-primary'} w-full max-w-xs`}
      >
        {loading ? '处理中...' : '上传并分析'}
      </button>
      
      {error && (
        <div className="text-red-500 mt-2">
          错误: {error}
        </div>
      )}
      
      {tableData && (
        <table className="table table-zebra w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{getValue(item, 'item') || getValue(item, 'Item') || '-'}</td>
                <td>${getValue(item, 'price') || getValue(item, 'Price') || '-'}</td>
                <td>{getValue(item, 'date') || getValue(item, 'Date') || '-'}</td>
                <td>{getValue(item, 'category') || getValue(item, 'Category') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}