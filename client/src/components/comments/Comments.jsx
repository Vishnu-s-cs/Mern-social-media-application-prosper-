import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import ReactTimeAgo from "react-time-ago";
import { SocketContext } from "../../context/socketContext";
import Swal from "sweetalert2";
const Comments = ({ post }) => {
  const [desc, setDesc] = useState("");
  const { currentUser, token } = useContext(AuthContext);
  const socket = useContext(SocketContext)
  const queryClient = useQueryClient();
  const handleNotification = (type) => {
    socket?.emit("sendNotification", {
      senderId: currentUser._id,
      type,
      userId:post.userId
    });
  };
  const sortedComments = post.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const config = {
    headers: {
      token: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const mutation = useMutation(
    (newComment) => {
      return axios.put(`/posts/${post._id}/comment`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        handleNotification("commented on your post")
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick(event);
    }
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {
      comment: desc,
      profilePic: currentUser.profilePicture,
      name: currentUser.username,
    };
    mutation.mutate(newComment);
    setDesc("");
  };
  const handleDelete = (commentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`posts/${post._id}/unComment?comment=${commentId}`).then((res)=>{
          // console.log(res,"ne shuper aada");
          queryClient.invalidateQueries(["posts"]);
        }).catch((err)=>{console.log(err);})
      // posts/6360aefa494f2c1db4badd44/unComment?comment=63635b4e4ae1fe3cb0012ba3
      }
    })

  };
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {sortedComments.map((comment) => (
        <div className="comment" key={comment._id}>
          <img src={comment.profilePic} alt="" />
          <div className="c_container">
            <div className="arrow">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.comment}</p>
            </div>
            {
              post.userId === currentUser._id&&
              <p onClick={()=>{handleDelete(comment._id)}}>delete</p>

            }
          </div>

          <span className="date">
            <ReactTimeAgo date={comment.createdAt} locale="en-US" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
