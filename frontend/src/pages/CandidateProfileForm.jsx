import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, LoaderCircle, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import useResendTimer from "@/hooks/useResendTimer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/api/emailVerification/verifyEmail";
import { sendOtp } from "@/api/emailVerification/sendOtp";
import { useToastOnError } from "@/hooks/useToastOnError";
import { setProfile } from "../redux/userProfileSlice";
import { setUser , setIsEmailVerification } from "../redux/authSlice";
import { validatePhoneNumber } from "../utils/phoneValidation";
import { submitUserProfile } from "../api/candidateProfile/createUserProfile";
import { Navigate, useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  const [skillInput, setSkillInput] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(
    user?.isEmailVerified || false
  );

  const [formData, setFormData] = useState({
    user_id: user?._id || "",
    fullname: "",
    phone: "",
    address: "",
    college: "",
    skills: [],
    experience: "",
    linkedinProfile: "",
    githubProfile: "",
    bio: "",
    resume: null,
    profilePhoto: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { timeLeft, isResendDisabled, handleResend } = useResendTimer();

  //API CALLS
  const {
    data: sendOtpData,
    isFetching: sendOtpIsFetching,
    isError: sendOtpIsError,
    refetch: sendOtpRefetch,
  } = useQuery({
    queryKey: ["otp"],
    queryFn: () => sendOtp(user?.email),
    enabled: false,
  });

  const submitVerificationCodeMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (data) {
        toast.success(data || "Email verified successfully.");
      }

      setIsEmailVerified(true);
      setShowOtpInput(false);
      dispatch(setIsEmailVerification({isEmailVerified : true}));
    },
    onError: (error) => {
      console.log("Error while verifying otp : ", error);
      toast.error(error.message || "Verifying OTP : Something went wrong");
    },
  });

  const submitProfileFormMutation = useMutation({
    mutationFn: submitUserProfile,
    onSuccess: (data) => {
      dispatch(setUser({user : data.data.newUpdatedUser}));
      // dispatch(setProfile({profile : data.data.createdProfile}));
      toast.success(data.message || "Candidate profile created successfully!");
      navigate("/");
    },
    onError: (error) => {
      console.log("Error while submitting profile : ", error);
      toast.error(error.message || "Profile submit : Something went wrong!");
    },
  });

  useToastOnError(sendOtpIsError, "Sending OTP failed. Please try again.");

  useEffect(() => {
    if (sendOtpData) {
      toast.success(sendOtpData);
    }
  }, [sendOtpData]);

  //handle form submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (!isEmailVerified) {
      toast.info("Recommandation : Verify your email before submit");
      return;
    }

    if (!validatePhoneNumber(formData.phone).isValid) {
      toast.error(validatePhoneNumber.message || "Phone number is not valid");
      return;
    }

    if (!formData.fullname || !formData.address) {
      toast.error("Enter all required fields");
      return;
    }

    submitProfileFormMutation.mutate(formData);
  };

  //first time otp sending function
  const handleVerifyEmail = () => {
    if (!user?.email) {
      toast.error("No email found for verification.");
      return;
    }
    console.log("Sending OTP to:", user?.email);
    sendOtpRefetch();
    setShowOtpInput(true);
  };

  //submit otp function
  const handleSubmitOtp = () => {
    if (!otp || otp.length !== 6) return;
    console.log("Submitting OTP:", otp);
    if (!user?.email || !user?._id) {
      toast.error("No email found for verification.");
      return;
    }

    submitVerificationCodeMutation.mutate({
      email: user?.email,
      id: user?._id,
      code: otp,
    });
    setOtp("");
  };

  //Resend otp function
  const handleResendOtp = () => {
    if (!user?.email) {
      toast.error("No email found for verification.");
      return;
    }

    sendOtpRefetch();
    handleResend(120);
  };

  // Handle skills
  const handleSkillInput = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  useEffect(() => {
    if (showOtpInput) {
      const otpInputs = document.querySelectorAll("#otp-input");
      otpInputs[0]?.focus();
    }
  }, [showOtpInput]);

  return (
    <div className="min-h-screen w-full p-2 sm:p-6 bg-gray-100">
      <Card className=" w-full sm:max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Profile Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
                value={user?.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Education and Experience */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                step="0.5"
                placeholder="Years of experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Linkedin profile and github profile */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <Label htmlFor="linkedinProfile">LinkedIn Profile URL</Label>
              <div className="relative">
                <Input
                  id="linkedinProfile"
                  name="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedinProfile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="pl-10"
                  required
                />
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A38C2]" />
              </div>
            </div>

            {/* GitHub Profile URL */}

            <div className="space-y-2">
              <Label htmlFor="linkedinProfile">Github Profile URL</Label>
              <div className="relative">
                <Input
                  id="githubProfile"
                  name="githubProfile"
                  type="url"
                  placeholder="https://github.com/your-profile"
                  value={formData.githubProfile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="pl-10"
                  required
                />

                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A38C2]" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (Press Enter to add)</Label>
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInput}
              placeholder="Type a skill and press Enter"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((s) => s !== skill),
                      }))
                    }
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* File Uploads */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume Upload */}

            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF only)</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.files[0],
                  }))
                }
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#6A38C2] file:text-primary-foreground hover:file:bg-[#5b30a6]"
              />
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.files[0],
                  }))
                }
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#6A38C2] file:text-primary-foreground hover:file:bg-[#5b30a6]"
              />
            </div>
          </div>

          {/* Email Verification */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Verification</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1 px-4 py-2 bg-gray-50 rounded-md border">
                  {user?.email ? (
                    <span className="text-gray-800 font-semibold">
                      {user?.email}
                    </span>
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      No email found
                    </span>
                  )}
                  {/* <span className="text-gray-600"></span> */}
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={
                    isEmailVerified || showOtpInput || sendOtpIsFetching
                  }
                  className={`whitespace-nowrap ${
                    isEmailVerified
                      ? "bg-green-500 text-white"
                      : "bg-[#6A38C2] text-white hover:bg-[#5b30a6]"
                  } `}
                >
                  {isEmailVerified ? "Email Verified ✓" : "Verify Email"}
                </Button>
              </div>
            </div>

            {/* OTP Input */}
            {showOtpInput && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex gap-2 justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      onChange={setOtp}
                      value={otp}
                      id="otp-input"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={handleSubmitOtp}
                    className="px-8 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
                  >
                    Submit OTP
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    variant="outline"
                    disabled={isResendDisabled}
                    className={`px-8 ${
                      isResendDisabled ? "cursor-not-allowed" : ""
                    } bg-white text-[#6A38C2] hover:bg-gray-100`}
                  >
                    {isResendDisabled
                      ? `Resend OTP (${timeLeft}s)`
                      : `Resend OTP`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitProfileFormMutation.isPending}
            className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
          >
            {!submitProfileFormMutation.isPending ? (
              "Submit Profile"
            ) : (
              <LoaderCircle className="h-4 w-4 animate-spin infinite" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileForm;
