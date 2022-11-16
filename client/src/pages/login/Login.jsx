import { useContext, useState } from "react";
import "./login.scss";
import FormInput from "../../components/formInput/FormInput";
import {Link, useNavigate} from 'react-router-dom'
// import Cookies from 'universal-cookie';
import { AuthContext } from "../../context/authContext";

const Login = () => {
  // const cookies = new Cookies();
  // const navigate = useNavigate()
  const [err, setErr] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const inputs = [
   
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
   
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    }
   
  ];
 let details=values
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      await login(details)
      navigate('/')
    } catch (error) {
      console.log(error);
      setErr(error.response.data)
    }    
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h1 style={{"paddingTop":"10px"}} className="icon">Prosper</h1>
        <div className="msg" style={{"paddingBottom":"10px"}}>Login to see what your friends are doing</div>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <div className="error"> {err&&err}</div>
       
        <button>Login</button>

            
     
          <div style={{"paddingBottom":"29px"}}>
          New here? <b><Link to="/register" className="link">Sign up now.</Link></b><br />
           
          </div>
      </form>
    </div>
  );
};

export default Login;