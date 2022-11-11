import "./share.scss";
import Image from "../../assets/img.png";
// import Map from "../../assets/map.png";
// import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import storage from "../../firebase";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import {useQueryClient } from "@tanstack/react-query";
// import { makeRequest } from "../../axios";
const Share = () => {

  // const [file, setFile] = useState(null)
  const [desc, setDesc] = useState(null)
  const [img, setImg] = useState(null);
  const {currentUser} = useContext(AuthContext)
  const handleChange = (e) => {
    const value = e.target.value;
    setDesc(value);
  };
  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async(url) => {
           
           
            makeRequest.post('/posts',{desc:desc,img:url})
          
            // setPost({desc:post,img:url})
            // console.log(post); 
          });
        }
      );
    });
  };
  const handleUpload = (e) => {
    console.log("button clicked");
    e.preventDefault();
    upload([
      { file: img, label: "img" },
    ]);
  //  await makeRequest.post('/posts',post)
  };
  // const queryClient = useQueryClient();
  // const mutation = useMutation(
  //   (newPost) => {
  //     return makeRequest.post("/posts", newPost);
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries(["posts"]);
  //     },
  //   }
  // );
  const handleClick = ()=>{
    // let imgUrl = "";
    // if (file) imgUrl = await upload();
    // mutation.mutate({ desc, img: imgUrl });
    // setDesc("");
    // setFile(null);
  }
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img
            src={currentUser.profilePicture}
            alt=""
          />
          <input type="text" name="desc" placeholder={`What's on your mind ${currentUser.username}?`} onChange={handleChange}/>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" name="img" id="file" style={{display:"none"}} onChange={e=>setImg(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            {/* <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div> */}
          </div>
          <div className="right">
            <button onClick={handleUpload}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
