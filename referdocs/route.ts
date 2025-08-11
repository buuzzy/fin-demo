import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface DifyChatRequestBody {
  inputs: any;
  query: string;
  user: string;
  response_mode: 'streaming' | 'blocking';
  conversation_id?: string;
}

interface DifyWorkflowRequestBody {
  inputs: {
    [key: string]: any;
  };
  user: string;
  response_mode: 'streaming';
  conversation_id?: string;
}

export async function POST(req: NextRequest) {
  const {
    query, // 用户输入
    conversation_id, // 会话 ID
    user_id, // 用户唯一标识
  } = await req.json();

  // 从环境变量中获取 Dify 配置
  const difyApiKey = process.env.DIFY_API_KEY;
  const difyBaseUrl = process.env.DIFY_BASE_URL;

  if (!difyApiKey || !difyBaseUrl) {
    return NextResponse.json(
      { error: 'Dify API key or Base URL is not set in environment variables.' },
      { status: 500 }
    );
  }

  try {
    // 构建发送给 Dify API 的请求体
    const difyRequestBody: DifyWorkflowRequestBody = {
      inputs: {
        query: query, // 使用 {query} 作为输入变量
      },
      user: user_id || 'default-user',
      response_mode: 'streaming',
      // conversation_id: conversation_id || '', // <--- 这是被移除的行
    };

    // 只有当 conversation_id 存在时才添加它
    if (conversation_id) {
      difyRequestBody.conversation_id = conversation_id;
    }

    // 向 Dify 发起请求
    const response = await fetch(`${difyBaseUrl}/workflows/run`, { // <--- 切换到 workflows/run
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${difyApiKey}`,
      },
      body: JSON.stringify(difyRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Dify API error: ${errorText}` },
        { status: response.status }
      );
    }

    // 将 Dify 的流式响应直接返回给客户端
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error calling Dify API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}