
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
import { io } from "socket.io-client";
import { DarkModeContext } from "../../context/darkModeContext";
import axios from "../../axios";
import InputEmoji from "react-input-emoji";

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
  const { currentUser,config } = useContext(AuthContext);
  const [conv, setConv] = useState({})
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
      conv?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage,conv]); 

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);

  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + currentUser._id);
  //       setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }; 
  //   getConversations();
  // }, [currentUser._id]);
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentUser._id,config);
      setConversations(res.data);
    };

    getFriends();
  }, [currentUser._id]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        await axios.get(
          `/conversations/find/${currentUser._id}/${currentChat}`,config
        ).then(async(response)=>{
          setConv(response.data)
          if (response.data==null) {
            await axios.post(
              `/conversations/`,{senderId:currentUser._id,receiverId:currentChat},config
            ).then(async()=>{
              await axios.get(
                `/conversations/find/${currentUser._id}/${currentChat}`,config
              ).then(async(res)=>{
              // setCurrentChat(res.data);
              setConv(res.data)
              await axios.get("/messages/" + res.data?._id,config).then((res)=>{
                axios.get("/users/" + currentChat,config).then((response)=>{
                  console.log(response);
                  setReciever(response.data)
                  
                })
                
                setMessages(res.data);
              });
              
              });
             
            });
          }else{
            // setCurrentChat(response.data);
        const res = await axios.get("/messages/" + response.data?._id,config);
        axios.get("/users/" + currentChat,config).then((response)=>{
          console.log(response);
          setReciever(response.data)
          
        })
        
        setMessages(res.data);
          }
          
        });
        
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
      conversationId: conv._id,
    };

    const receiverId = conv.members.find( 
      (member) => member !== currentUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message,config);
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
  const handleChange = (newMessage) => {
    setErr(false)
    setNewMessage(newMessage);
  };
  return (
    <>
    <div className={`theme-${darkMode? "dark":"light"} animate-slideleft`}>

      <Navbar />
      <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 8 }}>
      <div className="messenger">
        <div className="chatMenu">
        <input value="Inbox" className="chatMenuInput" disabled style={{ marginTop: "0.6rem",textAlign:"center"}}/>
          <div className="chatMenuWrapper">
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c._id)} key={c._id}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          {currentChat&&<img
          className="messageImg"
          src={reciever?.profilePicture.length!==0?reciever?.profilePicture:"https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
          alt=""
        />}
          <input value={reciever?reciever.username:"chat"} className="receiver chatMenuInput" disabled/>
            {currentChat ? (
              <>
                <div className="chatBoxTop mt-3">
                
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m.createdAt}>
                      <Message message={m} own={m.sender === currentUser._id} />
                    </div>
                  ))}
                </div>
                {err&&err}
                <div className="chatBoxBottom">
                <InputEmoji value={newMessage} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}/>
                  {/* <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {setNewMessage(e.target.value);setErr(false)}}
                    value={newMessage}
                    onKeyDown={handleKeyDown}
                  ></textarea> */}
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText font-bold text-5xl text-center mt-32">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline" style={{display:"none"}}>
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={currentUser._id}
              setCurrentChat={setCurrentChat}
              setReciever={setReciever}
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
