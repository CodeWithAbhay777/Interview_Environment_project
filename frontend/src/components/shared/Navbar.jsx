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

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const { userProfile } = useSelector((store) => store.profile);
  const dispatch = useDispatch();
 

  console.log("NAVBAR : logggged")

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md  ">
      <div className="flex items-center justify-between mx-auto w-full px-4 md:max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Jobify<span className="text-[#6A38C2]">.AI</span>
          </h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="border-2xl border-black">
              <AvatarImage src={userProfile?.profilePhoto || 'https://github.com/shadcn.png'} />
              <AvatarFallback>JAI</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[12rem]">
            <DropdownMenuLabel>{user?.role || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link to="/">Home</Link>
                
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link to="/jobs">Job openings</Link>
                
            </DropdownMenuItem>
            
            {
                user?.role === "admin" && (
                    <>
                    <DropdownMenuItem>
                        <Link to="/dashboard">Dashboard</Link>
                        
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/profile">Profile</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/notifications">Notifications</Link>
                  
                    </DropdownMenuItem>
                    </>
                )
            }

            {
                user?.role === "candidate" && (
                    <>
                    <DropdownMenuItem>
                        <Link to="/profile">Profile</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/notifications">Notifications</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/upcoming-interviews">Upcoming Interviews</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/applied-jobs">Applied jobs</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/results">Results</Link>
                  
                    </DropdownMenuItem>
                    
                    </>
                )
            }

            {
                user?.role === "recruiter" && (
                    <>
                    <DropdownMenuItem>
                        <Link to="/profile">Profile</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/notifications">Notifications</Link>
                  
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to="/upcoming-interviews">Upcoming Interviews</Link>
                  
                    </DropdownMenuItem>
                    
                    </>
                )
            }
            
            <DropdownMenuItem>About us</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
