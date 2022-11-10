import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from 'styled-components';
import 'xp.css';
import { Input, SendMessageButton } from '../App';
import signInLogo from '../assets/signIn.jpg';

interface SignInWindowProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
  roomID: string;
  username: string;
  joinRoom: () => void;
  leaveRoom: (setJoinedRoom?: Dispatch<SetStateAction<boolean>>) => void;
}

const SignOnWindow: React.FC<SignInWindowProps> = ({
  setUsername,
  setRoomID,
  setRoomName,
  roomName,
  roomID,
  username,
  joinRoom,
  setShowLogin,
  leaveRoom
}) => {
  const [toggle, setToggle] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);

  const handleJoinRoom = async () => {
    joinRoom();
    setJoinedRoom((state) => !state);
  };

  return (
    <Window className="window">
      <TitleBar className="title-bar">
        <div className="title-bar-text">Sign On</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button
            aria-label="Close"
            onClick={() => setShowLogin((state) => !state)}
          ></button>
        </div>
      </TitleBar>
      {joinedRoom ? (
        <WindowBody className="window-body">
          <span>Signed in as: {username}</span>
          <span>Room Name: {roomName}</span>
          <span>Room ID: {roomID}</span>
          <SendMessageButton onClick={() => leaveRoom(setJoinedRoom)}>
            Leave Room
          </SendMessageButton>
        </WindowBody>
      ) : (
        <WindowBody className="window-body">
          <Image src={signInLogo} alt="" />
          <InputsWrapper>
            <div>
              <ScreenName>ScreenName</ScreenName>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Username..."
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <form id="form">
              {toggle ? (
                <>
                  <span>Room ID </span>
                  <Input
                    id="roomID"
                    type="text"
                    name="roomID"
                    placeholder="123123"
                    required
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span>Room Name </span>
                  <Input
                    id="roomName"
                    type="text"
                    name="roomName"
                    placeholder="Davids Hotdog chat"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                  <br />
                  <br />
                  <span>Room ID </span>
                  <Input
                    id="roomID"
                    type="text"
                    name="roomID"
                    placeholder="123123"
                    required
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                </>
              )}
            </form>
          </InputsWrapper>
          <ToggleOption onClick={() => setToggle((state) => !state)}>
            {' '}
            {toggle ? `Create a room` : `Join a room`}
          </ToggleOption>
          {toggle ? (
            <JoinRoomButton onClick={handleJoinRoom}>Join Room</JoinRoomButton>
          ) : (
            <CreateRoomButton onClick={handleJoinRoom}>
              Create Room
            </CreateRoomButton>
          )}
        </WindowBody>
      )}
    </Window>
  );
};

export default SignOnWindow;

export const TitleBar = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0.3rem;
`;

const Image = styled.img`
  width: 100%;
  margin-bottom: 0.8rem;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.8rem;
`;

const ScreenName = styled.span`
  color: navy;
  font-weight: bolder;
  font-size: larger;
  font-style: italic;
`;

export const WindowBody = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
`;

const JoinRoomButton = styled.button`
  margin-top: 0.7rem;
  align-self: flex-end;
`;

const ToggleOption = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: blue;
`;

const Window = styled.div`
  height: fit-content;
`;

const CreateRoomButton = styled(JoinRoomButton)``;
