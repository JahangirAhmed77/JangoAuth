import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true; // Ensure axios sends cookies with requests
    const backendurl=import.meta.env.VITE_BACKEND_URL;
    const [isloggedin,setisloggedin] = useState(false);
    const [userdata, setuserdata] = useState(null);

    const getUserData=async () => {
        try {
            const {data} = await axios.get(`${backendurl}/api/user/data`, { withCredentials: true });
            if (data.success) {
                setuserdata(data.userData);
                console.log(data)
            } else {
                setuserdata(null);
                toast.error(data.message); 
            }
        } catch (error) {
            setuserdata(null);
            if (error.response?.status === 401) {
                // Don't show the generic error, let getAuthState handle the notification
            } else {
                toast.error(error.message)
            }
        }
    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendurl}/api/auth/is-auth`);
            if(data.success)    {
                setisloggedin(true);
                getUserData();
            } else {
                setisloggedin(false);
                setuserdata(null);
            }
        } catch (error) {
            setisloggedin(false);
            setuserdata(null);
            if (error.response?.status === 401) {
                toast.error("Please log in to continue.");
            } // Only show custom message for 401
            else {
                toast.error(error.message);
            }
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);
    const value={
        backendurl,
        isloggedin,setisloggedin,
        userdata,setuserdata,
        getUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};