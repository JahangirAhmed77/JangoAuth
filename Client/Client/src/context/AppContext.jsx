import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const AppContextProvider = (props) => {

    const backendurl=import.meta.env.VITE_BACKEND_URL;
    const [isloggedin,setisloggedin] = useState(false);
    const [userdata, setuserdata] = useState(null);

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('authToken');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }, []);

    const getUserData=useCallback(async () => {
        try {
            const {data} = await axios.get(`${backendurl}/api/auth/user-data`);
            if (data.success) {
                setuserdata(data.userData);
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
    }, [backendurl]);

    const getAuthState = useCallback(async () => {
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
            if (error.response?.status !== 401) toast.error(error.message);
        }
    }, [backendurl, getUserData]);

    useEffect(() => {
        getAuthState();
    }, [getAuthState]);
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