import type { FC } from "react";
import { useState } from "react";

import { Button, Input } from "@telegram-apps/telegram-ui";

import sendIcon from "@/components/ChatInput/send.svg"

import { bem } from "@/css/bem";

import "./ChatInput.css";


const [, e] = bem("chat-input");


interface Props {
    onSend: (text: string) => void;
}


export const ChatInput: FC<Props> = ({ onSend }) => {

    const [text, setText] = useState("");


    const send = () => {
        const value = text.trim();

        if (!value) {
            return;
        }

        onSend(value);
        setText("");
    };


    return (
        <div className={e("container")}>

            <Input
                className={e("input")}
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        send();
                    }
                }}
                placeholder="Сообщение..."
            />

            <Button
                className={e("btn")}
                onClick={send}
            >
                <img src={sendIcon} alt="" />
            </Button>

        </div>
    );
};