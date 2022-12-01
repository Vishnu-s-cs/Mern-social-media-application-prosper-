import Post from "../post/Post";
import "./posts.scss";
import {useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import { useState } from "react";
import Cookies from 'universal-cookie';

const Posts = ({userId}) => {
  const [err, setErr] = useState(false)
  const cookies = new Cookies();

  const { isLoading, error, data } = useQuery(["posts"], () =>
  makeRequest.get(userId ?  `posts/profile/${userId}` : "posts/timeline/all").then((res) => {
    const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return sortedPosts;
  }).catch((e)=>{
    localStorage.removeItem("user");
    cookies.remove('accessToken');
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
