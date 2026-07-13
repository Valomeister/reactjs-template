import { FC, useEffect, useState, useRef} from "react";

import { Cell, List } from "@telegram-apps/telegram-ui";

import { retrieveLaunchParams, retrieveRawInitData } from "@tma.js/sdk-react";

import { useNavigate, useParams } from "react-router-dom";

import { Page } from "@/components/Page";

import { Chat } from "@/components/Chat/Chat";

import { connectChatSocket } from "@/api/chatSocket";

import type { Order, Message } from "@/components/Chat/Chat.tsx";

import { ChatInput } from "@/components/ChatInput/ChatInput";

import { markMessageRead, sendMessage } from "@/api/chats";

import { backButton  } from "@tma.js/sdk-react"; 



export interface ChatResponse {
    order: Order;
    messages: Message[];
}


export const ChatPage: FC = () => {

    const { id } = useParams<{ id: string }>();

    const [chat, setChat] = useState<ChatResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!backButton) return;

        backButton.show();

        const handleBack = () => {
            console.log("Клик сработал через типизированный SDK! Единичка:", 1);
            navigate('/', { replace: true });
        };

        const removeListener = backButton.onClick(handleBack);

        return () => {
            removeListener();
            backButton.hide();
        };
    }, [navigate, id]);


    useEffect(() => {

        const initData = retrieveRawInitData();

        if (!initData || !id)
            return;

        const socket = connectChatSocket(
            initData,
            id,
            (event) => {

                switch (event.type) {

                    case "init":

                        setChat({
                            order: event.order,
                            messages: event.messages,
                        });

                        setLoading(false);

                        break;

                    case "message":

                        setChat(prev => {

                            if (!prev)
                                return prev;

                            return {
                                ...prev,
                                messages: [
                                    ...prev.messages,
                                    event.message,
                                ],
                            };

                        });

                        break;

                    case "message_read":
                        setChat(prev => {
                            if (!prev)
                                return prev;

                            return {
                                ...prev,
                                messages: prev.messages.map(message =>
                                    message.id === event.message_id
                                        ? {
                                            ...message,
                                            read_at: event.read_at,
                                        }
                                        : message
                                ),
                            };
                        });

                        break;
                }
            },
        );

        return () => socket.close();

    }, [id]);


    const myId =
        retrieveLaunchParams()
            .tgWebAppData
            ?.user
            ?.id ?? 0;

    const handleRead = async (
        messageId:number
    ) => {

        if (!id)
            return;

        const initData =
            retrieveRawInitData();

        if (!initData)
            return;

        await markMessageRead(
            initData,
            id,
            messageId
        );
    };


    return (
        <Page>

            {
                loading
                    ? <div className='loading'>loading...</div>
                    :
                    chat &&
                    <>
                        <Chat
                            myId={myId}
                            messages={chat.messages}
                            order={chat.order}
                            onRead={handleRead}
                        />
                        <ChatInput
                            onSend={async (text) => {

                                if (!id)
                                    return;

                                const initData = retrieveRawInitData();

                                if (!initData)
                                    return;

                                await sendMessage(
                                    initData,
                                    id,
                                    text,
                                );
                            }}
                        />
                    </>
            }

        </Page>
    );
};