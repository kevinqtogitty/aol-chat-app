import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Input, SendMessageButton } from '../App';
import { TitleBar, WindowBody } from './SignOnWindow';
import notificationAudio from '../assets/notification.wav';
import buddyInAudio from '../assets/BuddyIn.wav';
import buddyOutAudio from '../assets/BuddyOut.wav';

interface ChatProps {
  socket: any;
  username: string;
  roomID: string;
  roomName: string;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  leaveRoom: (setJoinedRoom?: Dispatch<SetStateAction<boolean>>) => void;
}

interface MessageProps {
  roomID: string;
  roomName: string;
  username: string;
  message: string;
  time: string;
}

const Chat: React.FC<ChatProps> = ({
  socket,
  username,
  roomID,
  roomName,
  leaveRoom
}) => {
  const [chatThread, setChatThread] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const eventListener = (data: MessageProps) => {
      playNotificationSound();
      setChatThread((chatThread) => [...chatThread, data]);
    };
    socket.on('receive_message', eventListener);
    return () => socket.off('receive_message', eventListener);
  }, [socket]);

  useEffect(() => {
    const eventListener = (data: { username: string; message: string }) => {
      playBuddyInSound();
      setChatThread((chatThread) => [...chatThread, data]);
    };
    socket.on('user_joined', eventListener);
    return () => socket.off('user_joined', eventListener);
  }, [socket]);

  useEffect(() => {
    const eventListener = (data: { username: string; message: string }) => {
      playBuddyOutSound();
      setChatThread((chatThread) => [...chatThread, data]);
    };
    socket.on('user_has_left', eventListener);
    return () => socket.off('user_has_left', eventListener);
  }, [socket]);

  const playNotificationSound = () => {
    new Audio(notificationAudio).play();
  };

  const playBuddyInSound = () => {
    new Audio(buddyInAudio).play();
  };

  const playBuddyOutSound = () => {
    new Audio(buddyOutAudio).play();
  };

  const sendMessage = async () => {
    try {
      if (message !== '') {
        const messageData = {
          roomName: roomName,
          roomID: roomID,
          username: username,
          message: message,
          time:
            new Date(Date.now()).getHours() +
            ':' +
            new Date(Date.now()).getMinutes()
        };
        await socket.emit('send_message', messageData);
        setChatThread((chatThread) => [...chatThread, messageData]);
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatWindow className="window">
      <TitleBar className="title-bar">
        <div className="title-bar-text">{roomName} Instant Message</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" onClick={() => leaveRoom()}></button>
        </div>
      </TitleBar>
      <ChatWindowBody>
        <MessagesBody className="window-body">
          {chatThread.map((message) =>
            message.username === username ? (
              <UserName>
                <YourMessage>{message.username}:</YourMessage>
                {message.message}
              </UserName>
            ) : (
              <UserName>
                <OtherMessage>{message.username}:</OtherMessage>
                {message.message}
              </UserName>
            )
          )}
        </MessagesBody>
        <SendMessageWrappers>
          <Input
            placeholder="Type your message here..."
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />

          <SendMessageButton onClick={sendMessage}>
            Send Message
          </SendMessageButton>
        </SendMessageWrappers>
      </ChatWindowBody>
    </ChatWindow>
  );
};

export default Chat;

const SendMessageWrappers = styled.div`
  display: flex;
  width: 100%;
  column-gap: 2rem;
  align-items: center;
  padding: 0rem 0.5rem;
`;

const ChatWindow = styled.div`
  width: 25rem;
`;

const ChatWindowBody = styled(WindowBody)`
  padding-bottom: 0.4rem;
`;

const MessagesBody = styled.div`
  padding: 0.3rem;
  min-height: 15rem;
  background-color: white;
  border: 0.5px solid black;
`;

const YourMessage = styled.p`
  font-size: 0.8rem;
  font-weight: bolder;
  color: red;
`;
const OtherMessage = styled(YourMessage)`
  color: blue;
`;

const UserName = styled.span`
  display: flex;
  column-gap: 0.3rem;
  font-size: 0.8rem;
`;
