'use client';

import { useReducer, FormEvent, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Constants for Dify API event types and node titles
const DIFY_EVENTS = {
  NODE_STARTED: 'node_started',
  TEXT_CHUNK: 'text_chunk',
  WORKFLOW_FINISHED: 'workflow_finished',
  WORKFLOW_FAILED: 'workflow_failed',
  ERROR: 'error',
};

const NODE_TITLES = {
  TECHNICAL_ANALYSIS: '技术分析',
  TRADING_DECISION: '交易决策分析',
  END: '结束',
};

// Type definitions
interface Message {
  isUser: boolean;
  text: string;
  isStreaming?: boolean;
}

interface TradeState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  nodeStatus: string | null;
  activeNode: string | null; // To track the current node being processed
}

type TradeAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'START_SUBMIT'; payload: { userMessage: Message } }
  | { type: 'SET_ACTIVE_NODE'; payload: string | null }
  | { type: 'ADD_MESSAGE_CHUNK'; payload: { text: string; isNewNode: boolean } }
  | { type: 'FINISH_STREAM'; payload?: string }
  | { type: 'SET_NODE_STATUS'; payload: string | null }
  | { type: 'REQUEST_FAILED'; payload: string }
  | { type: 'REQUEST_ABORTED' };

const initialState: TradeState = {
  messages: [],
  input: '',
  isLoading: false,
  nodeStatus: null,
  activeNode: null,
};

function tradeReducer(state: TradeState, action: TradeAction): TradeState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'START_SUBMIT':
      return {
        ...state,
        isLoading: true,
        messages: [...state.messages, action.payload.userMessage, { isUser: false, text: '', isStreaming: true }],
        nodeStatus: '准备中...',
        input: '',
        activeNode: null,
      };
    case 'SET_ACTIVE_NODE':
      return { ...state, activeNode: action.payload };
    case 'ADD_MESSAGE_CHUNK': {
      const { text, isNewNode } = action.payload;
      const nodeTitle = state.activeNode === NODE_TITLES.TECHNICAL_ANALYSIS ? '### 技术分析\n\n' : state.activeNode === NODE_TITLES.TRADING_DECISION ? '\n\n### 交易决策\n\n' : '';
      const prefix = isNewNode ? nodeTitle : '';
      const updatedMessages = state.messages.map((msg, index) =>
        index === state.messages.length - 1 ? { ...msg, text: msg.text + prefix + text } : msg
      );
      return { ...state, messages: updatedMessages };
    }
    case 'FINISH_STREAM': {
        const finalMessages = state.messages.map((msg, index) => {
            if (index === state.messages.length - 1) {
                // When finishing the stream, just mark isStreaming as false.
                // The text has already been accumulated.
                return { ...msg, isStreaming: false };
            }
            return msg;
        });
        return { ...state, messages: finalMessages, isLoading: false, activeNode: null };
    }
    case 'SET_NODE_STATUS':
      return { ...state, nodeStatus: action.payload };
    case 'REQUEST_FAILED':
    case 'REQUEST_ABORTED': {
        const newMessages = [...state.messages];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
            lastMessage.text = action.type === 'REQUEST_FAILED' ? action.payload : (lastMessage.text.trim() ? lastMessage.text + '\n\n**已中止。**' : '**已中止。**');
            lastMessage.isStreaming = false;
        }
        return {
            ...state,
            messages: newMessages,
            isLoading: false,
            activeNode: null,
        };
    }
    default:
      return state;
  }
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (displayedText === text) {
        return;
    }

    if (text.length < displayedText.length) {
        setDisplayedText(text.charAt(0) || '');
        return;
    }

    const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
    }, 15);

    return () => clearTimeout(timeoutId);
  }, [text, displayedText]);

  return (
      <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedText}
          </ReactMarkdown>
      </div>
  );
};

export default function TradePage() {
  const [state, dispatch] = useReducer(tradeReducer, initialState);
  const { messages, input, isLoading, nodeStatus, activeNode } = state;

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const finalAssistantMessageRef = useRef<string>(''); // To store the complete assistant message

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, nodeStatus]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let bufferedContent = '';

    const handleStreamEvent = (data: any) => {
      switch (data.event) {
          case DIFY_EVENTS.NODE_STARTED:
              const nodeTitle = data.data.title;
              if (nodeTitle === NODE_TITLES.END) {
                  // This status will be updated in the 'finally' block of handleSubmit
              } else {
                  dispatch({ type: 'SET_NODE_STATUS', payload: `正在执行: ${nodeTitle}` });
                  if (nodeTitle === NODE_TITLES.TECHNICAL_ANALYSIS || nodeTitle === NODE_TITLES.TRADING_DECISION) {
                      dispatch({ type: 'SET_ACTIVE_NODE', payload: nodeTitle });
                  }
              }
              break;
          case DIFY_EVENTS.TEXT_CHUNK:
              const isNewNode = activeNode === NODE_TITLES.TECHNICAL_ANALYSIS || activeNode === NODE_TITLES.TRADING_DECISION;
              const chunkText = data.data.text;
              finalAssistantMessageRef.current += chunkText; // Accumulate text
              dispatch({ type: 'ADD_MESSAGE_CHUNK', payload: { text: chunkText, isNewNode } });
              if (isNewNode) {
                dispatch({ type: 'SET_ACTIVE_NODE', payload: null }); // Reset after adding title
              }
              break;
          case DIFY_EVENTS.WORKFLOW_FINISHED:
              dispatch({ type: 'FINISH_STREAM' });
              break;
          case DIFY_EVENTS.WORKFLOW_FAILED:
          case DIFY_EVENTS.ERROR:
              const errorMessage = data.data?.message || '工作流执行失败。';
              dispatch({ type: 'SET_NODE_STATUS', payload: `执行失败: ${errorMessage}` });
              dispatch({ type: 'REQUEST_FAILED', payload: `**错误:** ${errorMessage}`});
              break;
      }
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        bufferedContent += decoder.decode(value, { stream: true });
        const lines = bufferedContent.split('\n');
        bufferedContent = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data:')) {
                const dataContent = line.substring(5).trim();
                if (dataContent === '[DONE]') continue;

                try {
                    const data = JSON.parse(dataContent);
                    handleStreamEvent(data);
                } catch (error) {
                    console.warn('Failed to parse JSON chunk:', error, 'Chunk:', dataContent);
                }
            }
        }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuestion = input; // 在 dispatch 清空 input 之前保存用户的问题
    const userMessage = { text: input, isUser: true };
    dispatch({ type: 'START_SUBMIT', payload: { userMessage } });

    abortControllerRef.current = new AbortController();
    finalAssistantMessageRef.current = ''; // Reset for new submission

    try {
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error('Response body is empty.');

      await processStream(response.body.getReader());

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by user.');
        dispatch({ type: 'REQUEST_ABORTED' });
      } else {
        console.error('Fetch error:', error);
        dispatch({ type: 'REQUEST_FAILED', payload: '抱歉，请求失败。' });
      }
    } finally {
      // The FINISH_STREAM is now dispatched from within WORKFLOW_FINISHED event
      dispatch({ type: 'SET_NODE_STATUS', payload: '已完成' });
      abortControllerRef.current = null;

      // Save chat to database after stream is finished
      const finalAssistantMessage = finalAssistantMessageRef.current;
      if (finalAssistantMessage.trim()) {
        try {
          await fetch('/api/trade-log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_message: userQuestion, // 使用保存下来的变量
              assistant_message: finalAssistantMessage,
              raw_response: finalAssistantMessage, 
            }),
          });
        } catch (logError) {
          console.error('Failed to log trade data:', logError);
        }
      }
    }
  };

  const StatusIndicator = ({ status, lastMessage }: { status: string | null; lastMessage?: Message }) => {
    if (!status) return null;
    if (status === '已中止' || status === '发生错误' || status.startsWith('执行失败')) {
        if (lastMessage && !lastMessage.isUser) return null; 
    }

    const isFinished = status === '已完成';
    const isRunning = status.startsWith('正在执行') || status === '准备中...';

    return (
      <div className="flex items-center self-start p-2 mt-2 text-sm text-gray-500 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-gray-400">
        {isFinished && <span className="w-3 h-3 mr-2 bg-green-500 rounded-full"></span>}
        {isRunning && (
          <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black">
      <Card className="flex flex-col flex-grow m-4 mb-0 rounded-b-none overflow-hidden">
        <CardHeader>
          <CardTitle>价格行为交易分析</CardTitle>
        </CardHeader>
        <CardContent ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 flex flex-col p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-2xl ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {msg.isStreaming ? (
                  <TypewriterText text={msg.text} />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <StatusIndicator status={nodeStatus} lastMessage={messages[messages.length - 1]} />
        </CardContent>
      </Card>
      <div className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
            placeholder="请输入您的问题..."
            disabled={isLoading}
            className="flex-grow"
          />
          {isLoading ? (
            <Button type="button" variant="destructive" onClick={handleStop}>中止</Button>
          ) : (
            <Button type="submit">生成技术分析报告</Button>
          )}
        </form>
      </div>
    </div>
  );
}