import React from "react";

export const MessageLog: React.FC<{ newMessage: string }> = (props) => {

    const messageLogRef = React.useRef<HTMLTextAreaElement>(null);
    const [lastMessage, setLastMessage] = React.useState("")

    const insertNewMessage = React.useCallback((msg: string) => {
        if (messageLogRef.current !== null) {
            messageLogRef.current.value += '\n' + msg + '\n';

            messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
        }
    }, [messageLogRef])

    React.useEffect(() => {
        if (props.newMessage !== lastMessage) {
            insertNewMessage(props.newMessage);
            setLastMessage(props.newMessage);
        }
    }, [props, lastMessage, insertNewMessage, setLastMessage]);

    return (
        <div>
            <textarea 
            ref={messageLogRef} 
            disabled={true}
            className="border-s-black border-dotted border-l-2 pl-4 h-full w-full overflow-y-scroll"
            
             />
        </div>
    )
}