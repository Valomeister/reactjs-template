import type { Chat } from '@/components/ChatList/ChatList.tsx';


const titles = [
  'Ремонт квартиры',
  'Доставка товара',
  'Разработка сайта',
  'Настройка сервера',
  'Перевод документа',
];


const messages = [
  'Когда сможете начать?',
  'Оплата получена',
  'Есть новые детали заказа',
  null,
  'Спасибо, всё отлично',
];


export const mockChats: Chat[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: i + 1,

    title: titles[
      Math.floor(Math.random() * titles.length)
    ],

    last_message:
      messages[
        Math.floor(Math.random() * messages.length)
      ],

    price:
      Math.random() > 0.2
        ? Math.round(Math.random() * 50000)
        : null,

    paycheck:
      Math.random() > 0.2
        ? Math.round(Math.random() * 30000)
        : null,
  }),
);