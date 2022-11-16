import { useState } from "react";
import "./update.scss";
import FormInput from "../../components/formInput/FormInput";
import axios from 'axios'
import Swal from 'sweetalert2'
import { useQueryClient} from "@tanstack/react-query";
const Update = ({ setOpenUpdate, user }) => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    city:"",
    desc:"",
    password: "",
    confirmPassword: "",
  });
const [error, setError] = useState(false);
  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: `${user.username}`,
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required:true
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: `${user.email}`,
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required:true
    }
    ,
    {
      id: 3,
      name: "city",
      type: "text",
      placeholder: `${user?.city}`,
      errorMessage: "Enter your city!",
      label: "City"
    },
    {
      id: 4,
      name: "desc",
      type: "text",
      placeholder: `${user?.desc}`,
      errorMessage: "Set your bio",
      label: "Bio"
    },
   
    {
      id: 5,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required:true
    },
    {
      id: 6,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: values.password,
      required:true
    },
  ];
  const queryClient = useQueryClient();
  const {confirmPassword,...others} = values
 let details=others
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${user._id}`,details).then((response) => {
        console.log('update success',response);
        setOpenUpdate(false)
        queryClient.invalidateQueries(["user"]);
    }).catch((err)=>{
      console.log(err,"hello");
     err.response.data.error?setError(err.response.data.error):setError(err.response.data)
      
    })
    } catch (error) {
      setError(error.response.data)
      console.log(error,"hello");
    }
   console.log(error);
   if(error)
   {
    Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error',
        confirmButtonText: 'ok'
      })
   }

  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <div className="">
      <form onSubmit={handleSubmit}>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <span className="error">{error&&error}</span>
        <button>Update</button>
      </form>
    </div>
       
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
}
export default Update
