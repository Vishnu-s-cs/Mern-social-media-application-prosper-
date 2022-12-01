import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";
import Cookies from 'universal-cookie';
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);
  const cookies = new Cookies();
  const [accessToken, setAccessToken] = useState("")
  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }
  const login = async(details) => {
    //TO DO
    await makeRequest.post(`/auth/login`,details,{withCredentials: true}).then((res)=>{
    
    setCurrentUser(res.data.other)
    setAccessToken(res.data.accessToken)
    })
   
  };

  useEffect(() => {
    if (currentUser!=undefined) {
      if (cookies.get('accessToken')) {
        console.log('hello');
    localStorage.setItem("user", JSON.stringify(currentUser));
        
      }else{
        cookies.set('accessToken', accessToken, { path: '/' });
        localStorage.setItem("user", JSON.stringify(currentUser));

      }
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};
