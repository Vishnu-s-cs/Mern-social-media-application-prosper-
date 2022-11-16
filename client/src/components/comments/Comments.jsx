import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import ReactTimeAgo from 'react-time-ago'

const Comments = ({post}) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.put(`/posts/${post._id}/comment`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {comment:desc,profilePic:currentUser.profilePicture,name:currentUser.username}
    mutation.mutate(newComment);
    setDesc("");
  };
 
 
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input type="text" placeholder="write a comment"  value={desc}
          onChange={(e) => setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {post.comments.map((comment) => (
            <div className="comment">
              <img src={comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.comment}</p>
              </div>
              <span className="date">
              <ReactTimeAgo date={comment.createdAt}locale="en-US"/>
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
