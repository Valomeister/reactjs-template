import type { FC  } from "react";
import { useEffect, useRef  } from "react";

import { Section, List } from "@telegram-apps/telegram-ui";

import { bem } from "@/css/bem";

import "./Chat.css";
import { MessageBubble } from "../MessageBubble/MessageBubble";


export interface Order {
  id: number;
  title: string;
  price: number;
  paycheck: number;
  manager_tg_id: number;
  worker_tg_id: number;
  customer_tg_id: number;
}

export interface Message {
  id: number;
  sender_tg_id: number;
  text: string;
  sent_at: string;
  read_at: string | null;
  type: string;
}

const [, e] = bem("chat")

interface Props {
    myId: number;
    messages: Message[];
    order: Order;
    onRead(
        messageId:number
    ):void;
}

export const Chat: FC<Props> = ({ myId, messages, order, onRead }) => {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "auto",
        });
    }, [messages]);

    return (
        <div className="chat">
        <div className={e("order_info")}>
            <div className={e("order_title")}>
                {order.title}
            </div>
        </div>
        {messages.map(message => (

            <MessageBubble
                key={message.id}
                message={message}
                order={order}
                myId={myId}
                orderId={order.id}
                onRead={onRead}
            />

        ))}

        <div ref={bottomRef} />
        
        </div>
    );
};