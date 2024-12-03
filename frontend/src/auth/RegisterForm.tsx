import React from "react";
import Form from "./Form";

const Bodydata = [
  {
    name: "username",
    label: "username",
    placeHolder: "Enter your username",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeHolder: "you@example.com",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeHolder: "Enter your password",
    type: "password",
  },
];
const footer = {
  button: "Signup",
  msg: "Have an account ?",
  link: "login",
};

const RegisterForm: React.FC = () => {
  return (
    <div className="">
      <Form
        footerData={footer}
        bodyData={Bodydata}
        route="/register"
        type="application/json"
      />
    </div>
  );
};

export default RegisterForm;
