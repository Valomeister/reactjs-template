import { FC, useEffect, useState } from "react";

import { Cell, List } from "@telegram-apps/telegram-ui";

import { retrieveLaunchParams, retrieveRawInitData } from "@tma.js/sdk-react";

import { useParams } from "react-router-dom";

import { Page } from "@/components/Page";

import { Chat } from "@/components/Chat/Chat";

import { fetchChat } from "@/api/chats";

import type { Order, Message } from "@/components/Chat/Chat.tsx";

import { ChatInput } from "@/components/ChatInput/ChatInput";

import { sendMessage } from "@/api/chats";



export interface ChatResponse {
    order: Order;
    messages: Message[];
}


export const ChatPage: FC = () => {

    const { id } = useParams<{ id: string }>();

    const [chat, setChat] = useState<ChatResponse | null>(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const initData = retrieveRawInitData();

        if (!initData || !id) {
            return;
        }

        fetchChat(initData, id)
            .then(setChat)
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [id]);


    const myId =
        retrieveLaunchParams()
            .tgWebAppData
            ?.user
            ?.id ?? 0;


    const handleSend = async (text: string) => {
        const initData = retrieveRawInitData();

        if (!initData || !id) {
            return;
        }

        try {
            const message = await sendMessage(
                initData,
                id,
                text
            );
            setChat((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        message,
                    ],
                };
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <Page>

            {
                loading
                    ? <Cell>Loading...</Cell>
                    :
                    chat &&
                    <>
                        <Chat
                            myId={myId}
                            messages={chat.messages}
                            order={chat.order}
                        />
                        <ChatInput
                            onSend={handleSend}
                        />
                    </>
            }

        </Page>
    );
};