import axios from "axios";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat,setReciever }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
   
          makeRequest.get("/users/" + user._id).then((response)=>{
            console.log(response);
            setReciever(response.data)})
      
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`
      );
     
      setCurrentChat(user._id);
      if (res.data==null) {
        await axios.post(
          `/conversations/`,{senderId:currentId,receiverId:user._id}
        ).then(async()=>{
          const res = await axios.get(
            `/conversations/find/${currentId}/${user._id}` 
          );
          console.log(res);
          setCurrentChat(res.data);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <input value="Online" className="chatMenuInput" disabled/>
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o._id}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? o.profilePicture
                  : "https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}