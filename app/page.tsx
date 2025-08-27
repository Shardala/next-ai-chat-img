'use client';

import React, { useState, useRef } from 'react';
import { Brain, Clock } from 'lucide-react';
import { getDateNow } from './helpers/common';
import { Message, Role, UserRole } from './types/types';
import { aiChatDefaultMsg, aiChatTitle, genericErrorMsg, noFileMsg } from './consts';

export const assistantRole = {
  tag: 'assistant' as UserRole,
  name: 'Chat Assistant'
};

export const userRole = {
  tag: 'user' as UserRole,
  name: 'User'
}

export default function Page() {
  const dateNow = getDateNow();

  const [messages, setMessages] = useState<Message[]>([
    { role: assistantRole, content: aiChatDefaultMsg, date: dateNow },
  ]);

  const [fileName, setFileName] = useState('');

  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input && !image) return;
    setLoading(true);

    const newMessages: Array<Message> = [...messages, { role: userRole, content: input || 'You sent an image: (' + fileName + ')', date: dateNow }];
    setMessages(newMessages);

    setInput('');

    try {
      if (image) {
        const res = await fetch('/api/image-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: image, prompt: input || 'Describe this image.' }),
        });

        const data = await res.json();

        setMessages(m => [...m, { role: assistantRole, content: data.reply, date: dateNow }]);
        setImage(null);
        setFileName('');

        if (fileRef.current) fileRef.current.value = '';
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        });

        const data = await res.json();

        setMessages(m => [...m, { role: assistantRole, content: data.reply, date: dateNow }]);
      }
    // eslint-disable-next-line
    } catch (e: any) {
      setMessages(m => [...m, { role: assistantRole, content: 'Error: ' + e.message, date: dateNow }]);
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(f);

    setInput('');

    setFileName(f.name ? f.name : '');
  };

  // eslint-disable-next-line
  const onInput = (e: any) => {
    setInput(e.target.value);

    setImage(null);
    setFileName('');
  }

  const getRoleClass = (inRole: Role) => {
    if (inRole.tag === 'user') {
      return 'role-user';
    }

    return 'role-assistant';
  }

  const clickFile = () => {
    document.getElementById('fileupload')?.click();
  }

  const buttonDisabled = loading || (!input && !fileName);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4 main-container">
      <h1 className="text-3xl font-bold flex flex-row justify-start align-center gap-3">
        <Brain className='brain-icon' />
        {aiChatTitle}
      </h1>
      <div className="space-y-4">
        <div className="card space-y-2 flex flex-col pb-6 p-5 top-card">
          <div>
            <textarea value={input} onChange={e => onInput(e)} placeholder="Ask something..." className={'input h-24 min-h-30 border ' + (input ? 'border-active' : 'border-deactive' )} />
          </div>
          <div>
            <span className='px-2'>Or inspect an image</span>
          </div>
          <div className={'input-area flex items-center justify-start gap-6 space-y-3 p-6 bg-black/20 rounded-2xl border ' + (fileName ? 'border-active' : 'border-deactive' )}>
            <button onClick={clickFile} className='bg-slate-700 hover:bg-sky-700 px-[40px] py-[15px] rounded-lg cursor-pointer m-0'>
              Select Image
            </button>
            <div className='flex'>
              <input id="fileupload" ref={fileRef} onChange={onFile} type="file" accept="image/*" className="input hidden" />
              <span className={'' + (fileName ? ' text-lime-400' : '')}>{fileName ? fileName : noFileMsg}</span>
            </div>
          </div>
          <div className='flex justify-end align-center mt-5'>
            <button onClick={send} className={'self-end px-[40px] py-[15px] rounded-lg' + (buttonDisabled ? ' bg-black/10 text-white/20' : ' cursor-pointer bg-slate-700 hover:bg-sky-700') } disabled={buttonDisabled}>
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>

        <div className="card space-y-3 p-6 bg-black/20 rounded-2xl border border-white/10">
          {messages.map((m, i) => {
            return (
              <div key={i} className={"card chat-card bg-black/20 flex flex-col justify-between align-stretch w-5/6 max-w-fit" + (m.role.tag === 'user' ? ' justify-self-end' : '')}>
                <div className='flex flex-row align-center justify-between rounded-t-2xl px-6 py-4 bg-black/10 '>
                  <div className={`text-xs opacity-70 ${getRoleClass(m.role)}`}>
                    {m.role.name}
                  </div>
                  <div className='flex flex-row align-center justify-end gap-2 ml-[20px]'>
                    <span className='text-gray-500'>
                      {m.date}
                    </span>
                    <Clock className='text-gray-500 size-4 mt-[5px]' />
                  </div>
                </div>
                <pre className='p-6 rounded-b-2xl bg-black/30 text-wrap'>
                  {m.content || genericErrorMsg}
                </pre>
              </div>
            )}
          )}
        </div>
      </div>
    </div>
  );
}
