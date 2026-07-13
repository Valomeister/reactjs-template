import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { retrieveRawInitData } from '@tma.js/sdk-react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { ChatList } from '@/components/ChatList/ChatList.tsx';

import type { Chat } from '@/components/ChatList/ChatList.tsx';
import { fetchChats } from '@/api/chats.ts';


import '@/general.css';

export const IndexPage: FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const initData = retrieveRawInitData();
    console.log("initData: " + initData);


    if (!initData) {
      console.error('No Telegram init data');
      setLoading(false);
      return;
    }


    fetchChats(initData)
      .then(setChats)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });


  }, []);

  return (
    <Page back={false}>
      <div>
        {
          loading
            ? <div className='loading'>loading...</div>
            : <ChatList chats={chats}/>
        }
        
      </div>
    </Page>
  );
};
