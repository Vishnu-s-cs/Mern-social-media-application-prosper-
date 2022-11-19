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
import Swal from 'sweetalert2'
const Post = ({ post }) => {
  const {currentUser} = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false);
  const [desc, setDesc] = useState(null)
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
        deleteMutation.mutate(post._id);
      }
    })
   
  };
  const handleUpdate = ()=>{
    // e.preventDefault()
    if (desc) {
      makeRequest.put(`posts/${post._id}`,{desc}).then((res)=>{
      setUpdateOpen(!updateOpen)
      queryClient.invalidateQueries(["posts"]);
      })
    }else{
      setDesc(null) 
      setUpdateOpen(!updateOpen)

    }
  }
  // const Input = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleUpdate()
      }
    }
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
         
          { post.userId === currentUser._id&&<MoreHorizIcon onClick={() => {setMenuOpen(!menuOpen)
     updateOpen && setUpdateOpen(!updateOpen)
    }} style={{cursor:"pointer"}}/>}
          {menuOpen && post.userId === currentUser._id && (
           <> 
           <button onClick={handleDelete}>Delete</button>
            <button onClick={handleUpdate} style={{top:"4rem",backgroundColor:"blue"}}>Update</button>
            </>
          ) }
          {updateOpen&&(<><input type="text" placeholder="update description" onChange={(e)=>setDesc(e.target.value)} onKeyDown={handleKeyDown}/></>)}
         
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
