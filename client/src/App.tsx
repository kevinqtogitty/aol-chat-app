import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as io from 'socket.io-client';
import styled from 'styled-components';
import Chat from './components/Chat';
import './index.css';
import 'xp.css';
import desktopIcon from './assets/desktopIcon.png';
import SignOnWindow, { TitleBar } from './components/SignOnWindow';

//Where the socket/server is located
const ENDPOINT = 'http://localhost:4000';
const socket = io.connect(ENDPOINT);

function App() {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const joinRoom = () => {
    if (username !== '' && roomID !== '') {
      setShowChat((state) => !state);
      socket.emit('join_room', {
        username: username,
        roomName: roomName,
        roomID: roomID
      });
    }
  };

  const leaveRoom = async (
    setJoinedRoom?: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      socket.emit('leave_room', { username: username, roomID: roomID });
      if (setJoinedRoom) {
        setJoinedRoom((state) => !state);
      }
      setShowChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WindowsWrapper>
      {showLogin ? (
        <>
          <SignOnWindow
            setUsername={setUsername}
            setRoomID={setRoomID}
            setRoomName={setRoomName}
            setShowChat={setShowChat}
            joinRoom={joinRoom}
            setShowLogin={setShowLogin}
            roomName={roomName}
            roomID={roomID}
            username={username}
            leaveRoom={leaveRoom}
          />
          <div>
            {showChat ? (
              <Chat
                socket={socket}
                username={username}
                roomID={roomID}
                roomName={roomName}
                setShowChat={setShowChat}
                leaveRoom={leaveRoom}
              />
            ) : null}
          </div>
        </>
      ) : null}
      <DesktopIconWrapper onDoubleClick={() => setShowLogin((state) => !state)}>
        <DesktopIcon src={desktopIcon} />
        <span>AIM</span>
      </DesktopIconWrapper>
    </WindowsWrapper>
  );
}

export default App;

export const Input = styled.input`
  width: 100%;
`;

const DesktopIcon = styled.img`
  height: 4rem;
  align-self: center;
`;

const DesktopIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 10rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-size: 1.4rem;
  align-items: center;
`;

const WindowsWrapper = styled.div`
  display: flex;
  column-gap: 2rem;
`;

export const MessagesContainer = styled.article`
  border: 2px solid blue;
  min-height: 20rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SendMessageButton = styled.button`
  align-self: center;
`;
