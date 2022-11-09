import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);
  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }
  const login = async(details) => {
    //TO DO
    const res = await axios.post(`/auth/login`,details,{withCredentials: true})
   
    setCurrentUser(res.data.other)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
