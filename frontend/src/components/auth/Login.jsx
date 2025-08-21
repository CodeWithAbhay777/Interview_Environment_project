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
    mutationKey: ["loginData"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data) {
        dispatch(setUser({ user: data.data, isAuthenticated: true }));
      }
      toast.success(`User login successfully!`);

      navigate("/");
    },

    onError: (err) => {
      setInput({ emailOrUsername: "", password: "", role: "" });

      toast.error(err.message || "Login user : Something went wrong");
    },
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.emailOrUsername || !input.password || !input.role) {
      toast.error("All fields are required!");
      return;
    }
    console.log(input);
    loginMutation.mutate(input);
  };
  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>
          <div className="my-2">
            <Label>Email or Username</Label>
            <Input
              type="text"
              value={input.emailOrUsername}
              name="emailOrUsername"
              onChange={changeEventHandler}
              placeholder="Enter email or username"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter password"
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="candidate"
                  checked={input.role === "candidate"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Candidate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {
            <Button type="submit" className="w-full my-4 bg-[#5b30a6]">
              Login
            </Button>
          }
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
