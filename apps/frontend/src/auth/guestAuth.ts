import { authState } from "@/recoil/userAtoms";
import {
  BaseUserInterface,
  getCookie,
  guest_api_endpoint,
  USER_TOKEN,
} from "@/utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export const useguestAuth = () => {
  const setAuthState = useSetRecoilState(authState);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
 
  const guestAuth = async () => {
    // setLoading(true);
     console.log("from here!! guest button");
    try {
      const url = guest_api_endpoint + "/createGuest";
      const response = await axios.post(url, {} , { withCredentials: true });

      if (response.data.success) {
        const decodedUser: BaseUserInterface =  response.data.user
        setAuthState({
        isAuthenticated: true,
        user: decodedUser,
      });
      
         console.log(
           "User authenticated successfully with token: ",
           decodedUser
         );
         navigate("/game");

      }
      
    } catch (e) {
      console.log(e);
    }
  };
  return guestAuth;
};
