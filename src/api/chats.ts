import type { Chat } from '@/components/ChatList/ChatList.tsx';
import type { Message } from '@/components/Chat/Chat.tsx';

export async function fetchChats(
  initData: string,
): Promise<Chat[]> {

  const response = await fetch('/api/chats', {
    method: 'GET',
    headers: {
      Authorization: `tma ${initData}`,
    },
  });


  if (!response.ok) {
    throw new Error(
      `Failed to fetch chats: ${response.status}`,
    );
  }


  return response.json();
}


export async function sendMessage(
    initData: string,
    orderId: string,
    text: string,
): Promise<Message> {

    const response = await fetch(
        `/api/chat/${orderId}/message`,
        {
            method: "POST",

            headers: {
                Authorization: `tma ${initData}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                text,
            }),
        }
    );


    if (!response.ok) {
        throw new Error("Failed to send message");
    }


    return response.json();
}


export async function markMessageRead(
    initData: string,
    orderId: string,
    messageId: number,
): Promise<void> {

    const response = await fetch(
        `/api/chat/${orderId}/message/${messageId}/read`,
        {
            method: "POST",

            headers: {
                Authorization: `tma ${initData}`,
            },
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to mark message read"
        );
    }
}