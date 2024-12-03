import React from "react";
import axios from "axios";
import { useUserContext } from "./UserContext";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { user_api_endpoint  } from "@/utils/constants";
import { authState, userState } from "@/recoil/userAtoms";

interface InputData {
  name: string;
  label: string;
  placeHolder: string;
  type: string;
}

interface FooterData {
  button: string;
  msg: string;
  link: string;
}

interface FormProps {
  bodyData: InputData[];
  footerData: FooterData;
  route: string;
  type: string;
}

export const logout = async (
  nagivate: any,
  setAuthToken: any,
  setUser: any
) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  try {
    const res = await axios.get(`${user_api_endpoint}/logout`, {
      withCredentials: true,
    });
    if (res.data.success) {
     
      toast.success("Logged out successfully");
    }

    console.log(res);
    setAuthToken(null);
    setUser(null);

    nagivate("/");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response?.data.message);
      } else {
        console.log("u1");
        toast.error("Unexpected error occured");
      }
    } else {
      console.log("u2");
      toast.error("Unexpected error occured");
    }
  }
};

const Form: React.FC<FormProps> = ({ bodyData, footerData, route, type }) => {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authState);
  const setUser = useSetRecoilState(userState);
  const { formData, setFormData } = useUserContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const action = `${user_api_endpoint}` + route;
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    const typedFormData = formData as Record<string, any>;
    for (const key in typedFormData) {
      if (formData.hasOwnProperty(key)) {
        data.append(key, typedFormData[key]);
      }
    }
    try {
      const res = await axios.post(action, data, {
        headers: {
          "Content-Type": type,
        },
        withCredentials: true,
      });
      console.log("Server response:", res.data);
      const { token, user } = res.data;

      if (res.data.success) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthToken(token);
        setUser(user);
        toast.success(res.data.message);

        if (route === "/login") {
          console.log("Login successful, navigating...");
          toast.success("Login successful!");
          navigate("/");
        } else {
          console.log("Signup successful, navigating...");
          toast.success("Signup successful!");
          navigate("/login");
        }

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data.message);
        } else {
          console.log("u1");
          toast.error("Unexpected error occured");
        }
      } else {
        console.log("u2");
        toast.error("Unexpected error occured");
      }
    }
  };

  return (
    <div className=" flex cust-400:items-center   justify-center w-full h-screen overflow-y-auto  p-2 ">
      <Card className="cust-400:min-w-[300px] w-[320px] cust-400:w-auto  cust-400:min-h-[60%] overflow-auto h-fit cust-400:mt-0 mt-10">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold font-qwitcher">
            Knights Chess
          </CardTitle>
          <CardDescription className="text-center  font-medium">
            Master the game of chess and sharpen your strategy!
          </CardDescription>
        </CardHeader>
        <form
          action={action}
          onSubmit={submitHandler}
          method="post"
          encType="multipart/form-data"
        >
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {bodyData.map((ele, index) => (
                <div key={index} className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">{ele.label}</Label>
                  {ele.type == "text" ? (
                    <Input
                      required
                      name={ele.name}
                      value={formData[ele.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      type={ele.type}
                      placeholder={ele.placeHolder}
                    />
                  ) : (
                    <Input
                      required
                      name={ele.name}
                      onChange={handleInputChange}
                      type={ele.type}
                      placeholder={ele.placeHolder}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between flex-col space-y-8">
            <Button type="submit" className="w-full">
              {footerData.button}
            </Button>
            <div>
              <span>{footerData.msg} </span>
              <a
                href={`/${footerData.link}`}
                className="text-primary hover:underline"
              >
                {footerData.link}
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Form;
