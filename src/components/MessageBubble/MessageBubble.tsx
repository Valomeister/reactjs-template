import { useEffect, useRef } from "react";

import type { Message, Order } from "@/components/Chat/Chat.tsx";

import "./MessageBubble.css";

import { bem } from "@/css/bem";

import sentIcon from "@/components/MessageBubble/sent.svg"
import readIcon from "@/components/MessageBubble/read.svg"
import placeholderImg from "@/components/MessageBubble/52x10.svg"
import smallerPlaceholderImg from "@/components/MessageBubble/36x10.svg"



interface Props {
    message: Message;
    order: Order;
    myId: number;
    orderId: number;
    onRead: (
        messageId: number
    ) => void;
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


export function MessageBubble({
    order,
    message,
    myId,
    onRead,
}: Props) {

    const ref = useRef<HTMLDivElement>(null);
    const reported = useRef(false);
    const [, e] = bem("bubble")

    useEffect(() => {
        if (
            message.sender_tg_id === myId ||
            message.read_at
        ) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    const visible = entries[0].isIntersecting;
                    console.log(order);
                    console.log(message);
                    console.log(myId);
                    if (
                        visible &&
                        document.visibilityState === "visible" &&
                        !reported.current &&
                        (
                            order.customer_tg_id === myId && order.worker_tg_id === message.sender_tg_id ||
                            order.worker_tg_id === myId && order.customer_tg_id === message.sender_tg_id ||
                            order.manager_tg_id === message.sender_tg_id
                        )
                    ) {
                        reported.current = true;

                        onRead(message.id);
                    }
                },
                {
                    threshold: 0.8,
                }
            );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [
        message.id,
        message.read_at,
    ]);



    return (
        <div
        ref={ref}
        className={
            e(
            "message",
            message.sender_tg_id === myId ? "mine" : "other"
            )
        }
        >

        {
            message.type === "system" ? (
                <div className={e("system_message")}>
                    {message.text}
                </div>
            ) : (
                <div className={e("bubble")}>
                    <div className={e("bubble_header")}>
                        <div className={`${e("author")} ${e(getSenderRole(message.sender_tg_id, order))}`}>
                            {rolesRu[getSenderRole(message.sender_tg_id, order)]}
                        </div>
                    </div>

                    <div className={e("bubble_body")}>
                        <span>
                            {message.text}{}
                            <img
                                className={e("spaceholder")}
                                src={
                                    message.sender_tg_id === myId ?
                                    placeholderImg :
                                    smallerPlaceholderImg
                                }
                                alt=""
                            />
                        </span>

                        <div className={e("msg_info")}>
                            <span className={e("time")}>
                                {new Date(message.sent_at).toLocaleTimeString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>

                            {message.sender_tg_id === myId && (
                                <img
                                    className={e("status")}
                                    src={message.read_at ? readIcon : sentIcon}
                                    alt=""
                                />
                            )}
                        </div>
                    </div>
                </div>
            )
        }
        </div>
            
    );
}