import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { makeRequest } from "../axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);


  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }
  const login = async(details) => {
    //TO DO
    await makeRequest.post(`/auth/login`,details,{withCredentials: true}).then((res)=>{
      console.log(res.data.other);
    setCurrentUser(res.data.other)
     
    })
   
  };

  useEffect(() => {
    if (currentUser!=undefined) {
    localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};
