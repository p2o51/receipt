import GeminiHelper from "./gemini";
import { NextResponse } from "next/server";
import {promises as fs} from "fs";

// app/api/gemini/route.js
export async function POST(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return NextResponse.json({ error: '请上传文件' }, { status: 400 });
      }
  
      // 使用 promises 版本的 fs
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = `/tmp/${file.name}`;
  
      try {
        await fs.writeFile(tempPath, buffer);  // 使用 promise 版本
        
        const gemini = new GeminiHelper(process.env.GEMINI_API_KEY);
        const result = await gemini.generateContent(
          `请从图片中提取出以下信息，注意每张小票作为一条记录。 其中 Item 是小票的名称，Price 是小票的价格（带有单位，通过情况综合判断币种，用字母表示币种，例如 2.99USD，200JPY），Date 是小票的日期，格式为YYYY-MM-DD，Category 是小票的分类。
          {
            "type": "object",
            "properties": {
              "Item": {
                "type": "string"
              },
              "Price": {
                "type": "number"
              },
              "Date": {
                "type": "string"
              },
              "Category": {
                "type": "string"
              }
            }
          }`,
          tempPath,
          "gemini-2.0-flash-exp"
        );
  
        // 清理临时文件
        await fs.unlink(tempPath);
  
        return NextResponse.json({ result });
  
      } catch (error) {
        console.error('处理错误：', error);
        return NextResponse.json({ 
          error: '处理失败: ' + error.message 
        }, { status: 500 });
      }
  
    } catch (error) {
      console.error('请求错误：', error);
      return NextResponse.json({ 
        error: '请求失败: ' + error.message 
      }, { status: 500 });
    }
  }