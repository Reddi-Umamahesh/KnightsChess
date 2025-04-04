import { authState } from "@/recoil/userAtoms";
import {
  BaseUserInterface,
 
  guest_api_endpoint,
  USER_TOKEN,
  
} from "@/utils/constants";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

type ChildProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const useguestAuth = () => {
  const setAuthState = useSetRecoilState(authState);
  const navigate = useNavigate();
 
  const guestAuth = async ({setLoading} : ChildProps) => {
    setLoading(true);
     console.log("from here!! guest button");
    try {
      const url = guest_api_endpoint + "/createGuest";
      const response = await axios.post(url);

      if (response.data.success && response.data.token) {
        const decodedUser: BaseUserInterface = jwtDecode(response.data.token);
        setAuthState({
          isAuthenticated: true,
          user: decodedUser,
        });
        localStorage.setItem(USER_TOKEN, response.data.token);
        console.log(
          "User authenticated successfully with token: ",
          decodedUser,
          localStorage.getItem(USER_TOKEN),
          response.data.token
        );
        toast.success(response.data.message);
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return guestAuth;
};
