import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/auth/logoutUser";
import { useGetProfileQuery } from "@/hooks/queries/useGetProfileQuery";
import { useToastOnError } from "@/hooks/useToastOnError";


const Navbar = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const { data: userProfile, isError: profileError } = useGetProfileQuery(user?._id, user?.role, {
    enabled: isAuthenticated && user?.isProfileComplete,
  });

  useToastOnError(profileError, 'Fetching profile : Something went wrong!');

  console.log("NAVBAR : logggged");

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully");
      dispatch(setUser({ user: null, isAuthenticated: false }));
    },
    onError: (err) => {
      toast.error(err.message || "Whilte logout : Something went wrong!");
    }
  })

  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md  ">
      <div className="flex items-center justify-between mx-auto w-full px-4 md:max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Jobify<span className="text-[#6A38C2]">.AI</span>
          </h1>
        </div>
        <div className="h-full flex items-center justify center gap-2 md:gap-4">
          {!isAuthenticated && (
            <Link to={"/login"}>
              <Button className="bg-[#6A38C2] hover:bg-[#8952e7]">Login</Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="border-2xl border-black">
                <AvatarImage
                  src={
                    userProfile?.profilePhoto || "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>JAI</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[12rem]">
              <DropdownMenuLabel>{user?.role || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/">
                <DropdownMenuItem>Home</DropdownMenuItem>
              </Link>
              <Link to="/jobs">
                <DropdownMenuItem>Job openings</DropdownMenuItem>
              </Link>

              {user?.role === "admin" && (
                <>
                  <Link to="/admin/dashboard/jobs">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link to="/recruiter/upcoming-interviews">
                    <DropdownMenuItem>Upcoming Interviews</DropdownMenuItem>
                  </Link>
                  <Link to="/notifications">
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onClick={logoutMutation.mutate}>Logout</DropdownMenuItem>

                </>
              )}

              {user?.role === "candidate" && (
                <>
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link to="/candidate/upcoming-interviews">
                    <DropdownMenuItem>Upcoming Interviews</DropdownMenuItem>
                  </Link>
                  <Link to="/candidate/results">
                    <DropdownMenuItem>Results</DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onClick={logoutMutation.mutate}>Logout</DropdownMenuItem>

                </>
              )}

              {user?.role === "recruiter" && (
                <>
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>

                  <Link to="/recruiter/upcoming-interviews">
                    <DropdownMenuItem>Upcoming Interviews</DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onClick={logoutMutation.mutate}>Logout</DropdownMenuItem>

                </>
              )}

              <Link to="/about">
                <DropdownMenuItem>About us</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
