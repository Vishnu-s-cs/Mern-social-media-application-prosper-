import Post from "../post/Post";
import "./posts.scss";
import {useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import { useState } from "react";
const Posts = ({userId}) => {
  const [err, setErr] = useState(false)
  const { isLoading, error, data } = useQuery(["posts"], () =>
  makeRequest.get(userId ?  `posts/profile/${userId}` : "posts/timeline/all").then((res) => {
    const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return sortedPosts;
  }).catch((e)=>{
    localStorage.removeItem("user");
    setErr(e.response.data+"please re-login");
  })
);

// console.log(posts);
  // console.log("data",data);
  //TEMPORARY
  // const posts = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     userId: 2,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
  //   },
  // ];

  return <div className="posts">
    {error? <span onClick={()=>{window.location.replace('/login')}} style={{cursor:"pointer"}}>{err}</span> :
      (isLoading ? "loading...":data.map(post=>(
        <Post post={post} key={post._id}/>
      )))
    }
   
  </div>;
};

export default Posts;
