
import "./messenger.scss";
import "../../style.scss"
// import Topbar from "../../components/topbar/Topbar";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { io } from "socket.io-client";
import { DarkModeContext } from "../../context/darkModeContext";
import { makeRequest } from "../../axios";

export default function Messenger() {
  
  const { darkMode } = useContext(DarkModeContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [err, setErr] = useState(false)
  const [reciever, setReciever] = useState(null)
  const socket = useRef();
  const { currentUser } = useContext(AuthContext);
  const scrollRef = useRef();
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
 
//  useEffect(()=>{
//   setMessage(false)
//   return()=>{setMessage(true)}
//  },[])
  // socket.current.on("getMessage", (data) => {
  //   console.log("emitted");
  //   setArrivalMessage({
  //     sender: data.senderId,
  //     text: data.text,
  //     createdAt: Date.now(),
  //   });
  // });
  // useEffect(()=>{
  //   socket.current.on("getMessage", (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // },[send])

  useEffect(() => {
   
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage,currentChat]); 

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + currentUser._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].sender!=currentUser._id) {
            
            makeRequest.get("/users/" + res.data[index].sender).then((response)=>{
              console.log(response);
              setReciever(response.data)
              
            })
            break;
          }
          
        }
        
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length!==0&&newMessage!=null) {
   
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }   
  }else{
    setErr("please enter a message")
  }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  }
  return (
    <>
    <div className={`theme-${darkMode? "dark":"light"} animate-slideleft`}>

      <Navbar />
      <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 8 }}>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input value="Inbox" className="chatMenuInput" disabled/>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          <input value={reciever?reciever.username:"chat"} className="chatMenuInput" disabled/>
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m.createdAt}>
                      <Message message={m} own={m.sender === currentUser._id} />
                    </div>
                  ))}
                </div>
                {err&&err}
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {setNewMessage(e.target.value);setErr(false)}}
                    value={newMessage}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={currentUser._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    </>
  );
}
