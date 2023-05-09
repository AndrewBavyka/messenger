import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chat-info">
        <span>{data.user?.displayName}</span>
        <div className="chat-icons">
          <img src={Cam} alt="camera" />
          <img src={Add} alt="add-friend" />
          <img src={More} alt="more-dots" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
