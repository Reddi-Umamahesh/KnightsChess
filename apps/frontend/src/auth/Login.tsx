import React from "react";
import Form from "./Form";

const Bodydata = [
  {
    name: "email",
    label: "Email or Username",
    placeHolder: "username or email",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeHolder: "Enter your password",
    type: "password",
  },
];
const footer = {
  button: "Login",
  msg: "Don't have an account ? ",
  link: "signup",
};

const LoginForm: React.FC = () => {
  return (
    <div>
      <div className="">
        <Form
          footerData={footer}
          bodyData={Bodydata}
          route="/login"
          type="application/json"
        />
      </div>
    </div>
  );
};

export default LoginForm;
