import type { FC } from "react";

import { Section, List } from "@telegram-apps/telegram-ui";

import { bem } from "@/css/bem";

import "./Chat.css";


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
}

const [, e] = bem("chat")

interface Props {
    myId: number;
    messages: Message[];
    order: Order;
}

const getSenderRole = (tgId: number, order: Order) => {
    if (tgId === order.manager_tg_id) {
        return "manager";
    }

    if (tgId === order.worker_tg_id) {
        return "worker";
    }

    if (tgId === order.customer_tg_id) {
        return "customer";
    }

    return "unknown";
};

const rolesRu: Record<string, string> = {
  manager: "Менеджер",
  worker: "Исполнитель",
  customer: "Заказчик",
  unknown: "Неизвестный",
};

export const Chat: FC<Props> = ({ myId, messages, order }) => {

    return (
        <div className="chat">
        <div className={e("order_info")}>
            <div className={e("order_title")}>
                {order.title}
            </div>
        </div>
        {messages.map((message) => (
            <div
            key={message.id}
            className={
                e(
                "message",
                message.sender_tg_id === myId ? "mine" : "other"
                )
            }
            >
                <div className={e("bubble")}>
                    <div className={e("bubble_header")}>
                        <div className={`${e("author")} ${e(getSenderRole(message.sender_tg_id, order))}`}>
                            {rolesRu[getSenderRole(message.sender_tg_id, order)]}
                        </div>
                    </div>
                    <div className={e("bubble_body")}>
                        <span>
                            {message.text}
                            <img className={e("spaceholder")} src="https://placehold.co/36x10" alt="" />
                        </span>

                        <span className={e("time")}>
                            {new Date(message.sent_at).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        ))}
        </div>
    );
};