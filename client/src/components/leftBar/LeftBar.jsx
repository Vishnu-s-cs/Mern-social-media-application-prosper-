import "./leftBar.scss";
// import Friends from "../../assets/1.png";
// import Groups from "../../assets/2.png";
// import Market from "../../assets/3.png";
// import Watch from "../../assets/4.png";
// import Memories from "../../assets/5.png";
// import Events from "../../assets/6.png";
// import Gaming from "../../assets/7.png";
// import Gallery from "../../assets/8.png";
// import Videos from "../../assets/9.png";
// import Messages from "../../assets/10.png";
// import Tutorials from "../../assets/11.png";
// import Courses from "../../assets/12.png";
// import Fund from "../../assets/13.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
const LeftBar = () => {
 
  const { currentUser } = useContext(AuthContext);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const handleLogout = () => {
    Swal.fire({
      title: 'Do you want to logout?',
     
      showCancelButton: true,
      confirmButtonText: 'Yes',
    
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
       
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
    
        window.location.replace('/login');
      } else if (result.isDenied) {
        
      }
    })
    
  
  };
  return (
    <div className="leftBar">
          <Link to="/" style={{ textDecoration: "none"}}>
          <span className="icon">prosper</span>
        </Link>

      <div className="container">
        <div className="menu">
        <Link to="/" style={{ textDecoration: "none",color:"black",padding:"0",margin:"0" }}>
          <div className="item">
          
            <HomeOutlinedIcon/>
            <span>Home</span>
           
          </div>
          </Link>
          <div className="item">
            <EmailOutlinedIcon/>
            <span>Messages</span>
          </div>
          <div className="item">
            <NotificationsOutlinedIcon/>
            <span>Notifications</span>
          </div>
        <Link to={'/profile/'+currentUser._id} style={{ textDecoration: "none",color:"black",padding:"0",margin:"0" }}>

          <div className="user">
            <img
              src={currentUser.profilePicture}
              alt=""
            />
            <span>Profile</span>
          </div>
          </Link>
          {/* <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div> */}
        </div>
        <hr />
        <div className="menu">
          <span>more</span>
          <div className="item">
          {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}<span>Dark/light</span>
          </div>
          <div className="item" onClick={()=>{handleLogout()}}>
          <ExitToAppIcon className="icon" style={{"paddingLeft":"0","fontSize":"1.5rem"}}/>
            <span>Logout</span>
          </div>
          {/* <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div> */}
        </div>
        {/* <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LeftBar;
