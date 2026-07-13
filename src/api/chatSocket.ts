import type { ChatResponse } from "@/pages/ChatPage";
import type { Message } from "@/components/Chat/Chat";

export type ChatEvent =
    | {
          type: "init";
          order: ChatResponse["order"];
          messages: Message[];
      }
    | {
          type: "message";
          message: Message;
      }
    | {
        type: "message_read";
        message_id: number;
        read_at: string;
    };

export function connectChatSocket(
    initData: string,
    orderId: string,
    onEvent: (event: ChatEvent) => void,
): WebSocket {

    const protocol =
        window.location.protocol === "https:"
            ? "wss"
            : "ws";

    const socket = new WebSocket(
        `${protocol}://${window.location.host}/api/chat/${orderId}/ws?init_data=${encodeURIComponent(initData)}`
    );

    socket.onmessage = (event) => {
        onEvent(JSON.parse(event.data));
    };

   socket.onclose = (event) => {
        console.log("WS closed", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        });
    };

    socket.onerror = (event) => {
        console.error("WS error", event);
    };
    return socket;
}