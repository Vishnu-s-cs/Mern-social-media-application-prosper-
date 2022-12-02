import Post from "../post/Post";
import "./posts.scss";
import {useQuery } from '@tanstack/react-query'
import  axios  from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({userId}) => {
  const [err, setErr] = useState(false)
  const {config} = useContext(AuthContext)
  

  const { isLoading, error, data } = useQuery(["posts"], () =>
  axios.get(config&&userId ?  (`posts/profile/${userId}`,config) : "posts/timeline/all",config).then((res) => {
    const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return sortedPosts;
  }).catch((e)=>{
    localStorage.removeItem("user");
    // localStorage.removeItem("accessToken");
    setErr(e.response.data+"please re-login");
  })
);



  return <div className="posts">
    {error? <span onClick={()=>{window.location.replace('/login')}} style={{cursor:"pointer"}}>{err}</span> :
      (isLoading ? "loading...":data.map(post=>(
        <Post post={post} key={post._id}/>
      )))
    }
   
  </div>;
};

export default Posts;
