import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import {useVerifyEmailOtp} from '../model'
import { useResendEmailOtp } from '../model'
import { otpVerificationSchema, type OtpSignupVerificationFormData} from "../schema/signup.schema";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import brandLogoDark from "@src/assets/brand-dark.png";
import otpSuccess from "@src/assets/shared/otp_success.png";

export default function VerifyEmailOtpInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("pendingEmailSignup");
  const message = location.state?.message || "We sent a verification code to";
  const [isVerified, setIsVerified] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const verifyMutation = useVerifyEmailOtp();
  const resendMutation = useResendEmailOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpSignupVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
  });

  const onSubmit = handleSubmit(async (data: OtpSignupVerificationFormData) => {

    try {
      const response = await verifyMutation.mutateAsync({
        email,
        otp_code: data.otp_code,
      });

      if (response.email_verified){
        sessionStorage.removeItem("pendingEmailSignup");
        setIsVerified(true);
      }
    } catch (error: unknown) {
       console.error("OTP verification error:", error);
    }
  }, (error) => console.log(error));

  const handleResendEmailOtp = async () => {
    try {
      if (!email) return;
      await resendMutation.mutateAsync({ email });
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  useEffect(() => {
    if (!isVerified) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isVerified, navigate]);

  return (
     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-[50px] px-8 pb-24">

          {!isVerified ? (
            <>
              {/* Brand Logo */}
              <div className="flex justify-center items-center relative">
                <Link to="/">
                  <img
                    src={brandLogoDark}
                    alt="Brand Logo"
                    className="w-64 object-cover cursor-pointer"
                  />
                </Link>
                <p className="absolute bottom-6 text-center text-base text-primary opacity-75">
                  Create Events. Gather People. Make It Happen.
                </p>
              </div>

              <h1 className="text-center text-primary font-bold text-4xl pb-3">
                Account Verification
              </h1>

              <input
                type="hidden"
                {...register("email")}
                value={email}
               />

              <p className="text-center text-base mb-8">
                {message}
                <br />
                Email: <span className="text-base">{email}</span>
              </p>

              <form onSubmit={onSubmit}>
                <div className="mb-2">
                  <label className="block text-responsive-xs text-primary mb-2">
                    Enter OTP Code
                  </label>

                  <input
                    type="text"
                    maxLength={6}
                    {...register("otp_code")}
                    placeholder="- - - - - -"
                    className={`w-full px-3 py-2 border ${
                      errors.otp_code ? "border-red-500" : "border-primary"
                    } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                  />

                  {errors.otp_code && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.otp_code.message}
                    </p>
                  )}
                </div>


                <p className=" mb-8">
                  OTP not received? <span className=" text-primary cursor-pointer" onClick={handleResendEmailOtp}>Resend</span>
                </p>

                <PrimaryButton
                  variant="button3"
                  label={verifyMutation.isPending ? "Submitting..." : "Submit"}
                  type="submit"
                  buttonClass="w-full"
                />
              </form>
            </>
          ) : (
            <>
              {/* Brand Logo */}
              <div className="flex justify-center items-center relative">
                <Link to="/">
                  <img
                    src={brandLogoDark}
                    alt="Brand Logo"
                    className="w-64 object-cover cursor-pointer"
                  />
                </Link>
                <p className="absolute bottom-6 text-center text-base text-primary opacity-75">
                  Create Events. Gather People. Make It Happen.
                </p>
              </div>

              <h1 className="text-center text-primary font-bold text-4xl pb-3">
                Account Verification
              </h1>

              <p className="text-center text-base">
                Verification complete. Your OTP was successfully confirmed.
                <br />
                Redirecting to login in{" "}
                <span>{seconds}</span> seconds...
              </p>

             <img
                src={otpSuccess}
                alt="OTP Success"
                className="w-54 object-cover cursor-pointer mx-auto my-12"
              />

              <PrimaryButton
                variant="button3"
                label="Proceed to login"
                buttonClass="w-full"
                onClick={() => navigate("/login")}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
}
