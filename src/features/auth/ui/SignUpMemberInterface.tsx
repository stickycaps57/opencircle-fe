import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import uploadIcon from "@src/assets/shared/upload_icon.png";
import brandLogoDark from "@src/assets/brand-dark.png";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberSignupSchema,
  type MemberSignupFormData,
} from "../schema/signup.schema";
import { useMemberSignup } from "../model/signup.mutations";
import { useTitleCase } from "@src/shared/hooks";

export default function SignUpMemberInterface() {
  const [preview, setPreview] = useState<string | null>(null);
  const memberSignupMutation = useMemberSignup();
  const navigate = useNavigate();

  // Setup form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MemberSignupFormData>({
    resolver: zodResolver(memberSignupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      bio: "",
      email: "",
      username: "",
      password: "",
      role_id: 1,
      profile_picture: undefined,
    },
  });

  // Handle profile picture upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        // Set the file in the form
        setValue("profile_picture", file);
      }
    },
    [setValue]
  );

  // Reset form, image preview and fields
  const resetForm = () => {
    // Reset React Hook Form fields
    reset({
      first_name: "",
      last_name: "",
      bio: "",
      email: "",
      password: "",
      profile_picture: undefined,
      role_id: 1,
    });

    // Clear preview
    setPreview(null);

  };

  // Handle form submission
  // Use titleCase hook
  const { toTitleCase } = useTitleCase();

  const onSubmit = handleSubmit(async (data) => {


    try {
      // Format names with title case
      const formattedData = {
        ...data,
        first_name: toTitleCase(data.first_name),
        last_name: toTitleCase(data.last_name),
      };

      // Remove profile_picture if it's empty or undefined
      if (!formattedData.profile_picture) {
        delete formattedData.profile_picture;
      }

      const response = await memberSignupMutation.mutateAsync(
        formattedData as MemberSignupFormData
      );

      if (response.verification_required && response.email) {

        sessionStorage.setItem("pendingEmailSignup", response.email);

        navigate("/otp-verification", {
          state: { email: response.email, message: response.message }
        });
        // navigate("/otp-verification");
      } else {
        navigate("/login");
      }

      // Navigate to home page after successful signup
      // navigate("/login");
      // Reset form after successful signup
      resetForm();
    } catch (error: unknown) {
      // Handle signup errors
      console.log(error)
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[50px] px-8 pb-24">
          <form onSubmit={onSubmit}>
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
                Discover Events. Meet People. Make an Impact.
              </p>
            </div>

            {/* Header */}
            <h1 className="text-center text-primary font-bold text-4xl pb-6">
              Member
            </h1>

            {/* First Name Field */}
            <div className="mb-6">
              <label
                htmlFor="first_name"
                className="block text-responsive-xs text-primary mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                {...register("first_name")}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="mb-6">
              <label
                htmlFor="last_name"
                className="block text-responsive-xs text-primary mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                {...register("last_name")}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div className="mb-5">
              <label
                htmlFor="bio"
                className="block text-responsive-xs text-primary mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                rows={4}
                className="my-0 w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
                placeholder="Tell us about yourself .."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-responsive-xs text-primary mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

             {/* Username Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-responsive-xs text-primary mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-base text-primary mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile Picture Field */}
            <div className="mb-6">
              <label className="block text-responsive-xs text-primary mb-2">
                Profile Picture
              </label>

              {!preview ? (
                <div
                  {...getRootProps()}
                  className="w-full h-40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <input {...getInputProps()} />
                  <img src={uploadIcon} className="rounded-full w-28" />
                </div>
              ) : (
                <div className="flex flex-col">
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-full h-48 object-contain "
                  />
                  <div
                    {...getRootProps()}
                    className="mt-3 cursor-pointer flex justify-center"
                  >
                    <input {...getInputProps()} />
                    <button
                      type="button"
                      className="px-4 py-2 text-responsive-xxs text-primary border border-primary rounded-2xl hover:bg-gray-50 transition"
                    >
                      Upload New Image
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-placeholderbg">
                People who use our service may have uploaded your contact
                information to OpenCircle.
              </p>
            </div>

            {/* Signup Buttons */}
            <div className="mb-6 flex flex-col space-y-3">
              <PrimaryButton
                variant="button3"
                label={
                  memberSignupMutation.isPending ? "Signing up..." : "Sign up"
                }
                buttonClass="w-full"
                type="submit"
              />
            </div>
          </form>

          {/* Horizontal Divider */}
          <div className="relative mb-6">
            <div className="w-full border-t border-gray-300" />
          </div>

          {/* Signup Link */}
          <div className="text-start">
            <p className="text-sm text-primary-75">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary">
                Log in
              </Link>
            </p>
          </div>
          <div className="text-start">
            <p className="text-sm text-primary-75">
              Want to be an organization?{" "}
              <Link to="/signup-org" className="text-secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
