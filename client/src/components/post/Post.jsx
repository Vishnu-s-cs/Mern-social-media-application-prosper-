import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import ReactTimeAgo from 'react-time-ago'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
const Post = ({ post }) => {
  const {currentUser} = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(post.likes.includes(currentUser._id)?true:false)
  const queryClient = useQueryClient();
  useEffect(() => {
    makeRequest.get(`users/${post.userId}`).then((res)=>{
      setUser(res.data)
    }).catch((err)=>{console.log(err);})
    post.likes.includes(currentUser._id)?setLiked(true):setLiked(false)
  }, [post])

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  
  //TEMPORARY
  // const liked = true;
  const handleLike = ()=>{
    makeRequest.put(`posts/${post._id}/like`).then(()=>{
      queryClient.invalidateQueries(["posts"]);
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(post._id);
  };
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={user.profilePicture} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{user.username}</span>
              </Link>
              <span className="date"><ReactTimeAgo date={post.createdAt}locale="en-US"/></span>
            </div>
          </div>
          { post.userId === currentUser._id&&<MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />}
          {menuOpen && post.userId === currentUser._id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content" onDoubleClick={handleLike}>
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? <FavoriteOutlinedIcon style={{color:"red"}}/> : <FavoriteBorderOutlinedIcon />}
            {post.likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comments.length} Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && <Comments post={post}/>}
      </div>
    </div>
  );
};

export default Post;
