import "./profile.scss";
// import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import PinterestIcon from "@mui/icons-material/Pinterest";
// import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import  axios  from "../../axios";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2'
import FollowModal from "../../components/followModal/FollowModal";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const Profile = () => {

  const [openUpdate, setOpenUpdate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [report, setReport] = useState('other')
  const [desc, setDesc] = useState(null)

  const [err, setErr] = useState(null)
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpen2, setIsOpen2] = useState(false);
  const [modalIsOpen3, setIsOpen3] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const { currentUser,config } = useContext(AuthContext);
  
  function openModal() {
    setIsOpen(true);
  }
  function openModal2() {
    setIsOpen2(!modalIsOpen2);
  }
  function openModal3() {
    setIsOpen3(!modalIsOpen3);
  }
  useEffect(()=>{
    const getAllUsers = (async()=>{
      axios.get(`users/`,config).then((users)=>{
        
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
   
  },[])

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const { id } = useParams()
  const userId = id;

  const { isLoading, error, data } = useQuery(["user"], () =>
    axios.get("/users/" + userId,config).then((res) => {
     
      return res.data;
    })
  );

  // const { isLoading: rIsLoading, data: relationshipData } = useQuery(
  //   ["relationship"],
  //   () =>
  //     axios.get("/relationships?followedUserId=" + userId).then((res) => {
  //       return res.data;
  //     })
  // );

  const queryClient = useQueryClient();



  const mutation = useMutation(
    (following) => {
      if (following)
        return axios.put(`users/${userId}/unfollow`,{},config);
      return axios.put(`users/${userId}/follow`,{},config);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(data.followers.includes(currentUser._id));
  };
  const handleReport = () => {
    // e.preventDefault()
    if (report=="other"&&desc.trim().length!==0&&desc!=null) {
   
      axios.put(`posts/${userId}/reportUser`, { reason:desc },config).then((res) => {
      
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'ok'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(null)
      }).catch((err)=>{
        setErr(err.response.data)
       
      })
    } else if(report!=="other") {
      axios.put(`users/${userId}/reportUser`, { reason:report },config).then((res) => {
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'ok'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(false)
      }).catch((err)=>{
        console.log(err.response.data);
        setErr(err.response.data)
      })

    }
    else{
      setErr("Please specify reason")
    }
  }
  // const Input = () => {
    const getFollowers = ()=>{

    }
    const getFollowings=async()=>{
      const res = await axios.get("/users/friends/" + currentUser._id,config);

    }
  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPicture} alt="" className="cover" />
            <img src={data.profilePicture} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.email}</span>
                  </div>

                </div>
                {/* <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a> */}
              </div>
              <div className="center">
                <span>{data.username}</span>
                {userId === currentUser._id ? <button onClick={() => setOpenUpdate(true)}>update</button>
                  :
                  <button onClick={handleFollow}>
                    {data.followers.includes(currentUser._id) ? 'following' : 'follow'}
                  </button>
                }
                  
                {/* {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )} */}
                <div className="desc">{data.desc} </div>
                <div className="item">

                  <span onClick={openModal3}style={{cursor:"pointer"}} >followers {data.followers.length}</span>&nbsp;&nbsp;
                  <span onClick={openModal2} style={{cursor:"pointer"}}>following {data.followings.length}</span>
                  {modalIsOpen3&&<FollowModal setIsOpen2={openModal3} ofUser={data} allUsers={{allUsers}} followings={false}/>}
      
                  {modalIsOpen2&&<FollowModal setIsOpen2={openModal2} ofUser={data} allUsers={{allUsers}} followings={true}/>}
                </div>
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon style={{ cursor: "pointer" }} onClick={()=>setMenuOpen(!menuOpen)}/>
                {userId !== currentUser._id&&(menuOpen && <button onClick={openModal} style={{ backgroundColor: "orange" }}>Report</button>)}
                <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Report</h2>
            <CloseIcon onClick={closeModal} className="close" />
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Please specify reason</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="other"
                name="radio-buttons-group"
              >
                <FormControlLabel value="spam" control={<Radio />} label="spam" onChange={e=>{setReport(e.target.value)}}/>
                <FormControlLabel value="fraud" control={<Radio />} label="fraud" onChange={e=>setReport(e.target.value)}/>
                <FormControlLabel value="false information" control={<Radio />} label="false information" onClick={e=>setReport(e.target.value)}/>
                <FormControlLabel value="other" control={<Radio />} label="other" onClick={e=>setReport(e.target.value)}/>
              </RadioGroup>
              {report==="other"&&<TextField id="standard-basic" label="please say more about it" variant="standard" onChange={e=>setDesc(e.target.value)}/>}
              {err&&<span style={{ top: "2rem", color: "red" }} className="err">{err}</span>}
              <Button variant="contained" endIcon={<SendIcon />} className="sendButton" onClick={handleReport}>Send</Button>
            </FormControl>
          </Modal>
              </div>
            </div>
            <Posts userId={userId} key={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      
    </div>
  );
};

export default Profile;
