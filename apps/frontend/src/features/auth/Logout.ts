import { user_api_endpoint, USER_TOKEN } from "@/utils/constants"
import axios from "axios";

import { toast } from "react-toastify";

const handleLogout = async(navigate:Function) => {
   
    try{
        const url = user_api_endpoint + '/logout';
        const res = await axios.post(url);
    if (res.status === 200) {
        localStorage.removeItem(USER_TOKEN);
    } else {
        toast.error("unexpected error occured try again")
    }
        toast.success(res.data.message)
        navigate("/")
    } catch (e) {
        toast.error("unexpected error occured try again");
        
    }
    
}

export default handleLogout