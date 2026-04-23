import React, { useEffect, useState } from "react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth/loginUser";

const Login = () => {
  const [input, setInput] = useState({
    emailOrUsername: "",
    password: "",
    role: "",
  });
  const { isAuthenticated, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  //API call
  const loginMutation = useMutation({
    // mutationKey: ["loginData"],
    mutationFn: loginUser,
    onSuccess: (data) => {

      if (data) {
        dispatch(setUser({ user: data.data, isAuthenticated: true }));
      }
      toast.success(`User login successfully!`);

      navigate("/");
    
    },

    onError: (err) => {
      
      console.log(err);

      toast.error(err.message || "Login user : Something went wrong");
      setInput({ emailOrUsername: "", password: "", role: "" });
    },
  });

  const submitHandler = async (e) => {
   
    e.preventDefault();

    if (!input.emailOrUsername || !input.password || !input.role) {
      toast.error("All fields are required!");
      return;
    }
   
   
    loginMutation.mutate(input);
  };
  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/");
    }
  }, []);
 

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-10">
      <form
        onSubmit={submitHandler}
        className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 border border-gray-200 rounded-md p-6 sm:p-8 max-w-md"
      >
        <h1 className="font-bold text-2xl sm:text-3xl mb-6">Login</h1>
        <div className="my-4">
          <Label className="block mb-2">Email or Username</Label>
          <Input
            type="text"
            value={input.emailOrUsername}
            name="emailOrUsername"
            onChange={changeEventHandler}
            placeholder="Enter email or username"
            className="w-full"
          />
        </div>

        <div className="my-4">
          <Label className="block mb-2">Password</Label>
          <Input
            type="password"
            value={input.password}
            name="password"
            onChange={changeEventHandler}
            placeholder="Enter password"
            className="w-full"
          />
        </div>
        <div className="my-4">
          <Label className="block mb-3 text-sm">Select Role</Label>
          <RadioGroup className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="candidate"
                checked={input.role === "candidate"}
                onChange={changeEventHandler}
                className="cursor-pointer w-4 h-4"
                id="candidate-login"
              />
              <Label htmlFor="candidate-login" className="cursor-pointer text-sm font-normal">Candidate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
                className="cursor-pointer w-4 h-4"
                id="recruiter-login"
              />
              <Label htmlFor="recruiter-login" className="cursor-pointer text-sm font-normal">Recruiter</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full my-6 bg-[#5b30a6] text-base py-2">
          Login
        </Button>
        <span className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
