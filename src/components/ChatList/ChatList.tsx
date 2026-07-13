import type { FC } from 'react';
import { Cell, Section } from '@telegram-apps/telegram-ui';

import { Link } from '@/components/Link/Link.tsx';
import { bem } from '@/css/bem.ts';

import './ChatList.css';

const [, e] = bem('chat-list');


export interface Chat {
  id: number;
  title: string;
  last_message: string | null;
  price: number | null;
  paycheck: number | null;
}


export interface ChatListProps {
  chats: Chat[];
}


const formatMoney = (value: number) => {
  return `${value.toLocaleString('ru-RU')} ₽`;
};


const Money = ({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) => (
  <span className={className}>
    {formatMoney(value)}
  </span>
);


export const ChatList: FC<ChatListProps> = ({ chats }) => {
  return (
    <Section className={e("section")}>
      {chats.map((chat) => {

        const hasPrice = chat.price !== null;
        const hasPaycheck = chat.paycheck !== null;

        return (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
          >
            <Cell
              className={e('item')}
              multiline
            >
              <div className={e('title')}>
                {chat.title}
              </div>

              <div className={e('message')}>
                {chat.last_message ?? 'Нет сообщений'}
              </div>


              <div className={e('money')}>

                {/* Только цена заказа */}
                {hasPrice && !hasPaycheck && (
                  <Money
                    value={chat.price!}
                  />
                )}


                {/* Только оплата исполнителю */}
                {!hasPrice && hasPaycheck && (
                  <Money
                    value={chat.paycheck!}
                    className={e('income')}
                  />
                )}


                {/* Есть оба значения */}
                {hasPrice && hasPaycheck && (
                  <>
                    <Money
                      value={chat.price!}
                      className={e('income')}
                    />

                    <Money
                      value={chat.paycheck!}
                      className={e('expense')}
                    />
                  </>
                )}

              </div>

            </Cell>
          </Link>
        );
      })}
    </Section>
  );
};