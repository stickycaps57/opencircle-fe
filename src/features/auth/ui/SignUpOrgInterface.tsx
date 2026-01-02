import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import uploadIcon from "@src/assets/shared/upload_icon.png";
import brandLogoDark from "@src/assets/brand-dark.png";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { organizationCategoryOptions } from "@src/shared/enums/organizationCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  organizationSignupSchema,
  type OrganizationSignupFormData,
} from "../schema/signup.schema";
import { useOrganizationSignup } from "../model";
import { useTitleCase } from "@src/shared/hooks";

export default function SignUpOrgInterface() {
  const [preview, setPreview] = useState<string | null>(null);
  const organizationSignupMutation = useOrganizationSignup();
  const navigate = useNavigate();

  // Setup form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrganizationSignupFormData>({
    resolver: zodResolver(organizationSignupSchema),
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
      email: "",
      username: "",
      password: "",
      role_id: 2,
      logo: undefined,
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        // Set file in form
        setValue("logo", file);
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
  });

  // Reset form, image preview and fields
  const resetForm = () => {
    // Reset form fields
    reset({
      name: "",
      description: "",
      category: undefined,
      email: "",
      password: "",
      logo: undefined,
      role_id: 2,
    });

    // Clear preview
    setPreview(null);

  };

  // Handle form submission
  // Use titleCase hook
  const { toTitleCase } = useTitleCase();

  const onSubmit = async (data: OrganizationSignupFormData) => {

    try {
      // Apply title case to organization name
      const formattedData = {
        ...data,
        name: toTitleCase(data.name),
      };

      // Remove profile_picture if it's empty or undefined
      if (!formattedData.logo) {
        delete formattedData.logo;
      }

      const response = await organizationSignupMutation.mutateAsync(
        formattedData as OrganizationSignupFormData
      );

      if (response.verification_required && response.email) {
        sessionStorage.setItem("pendingEmailSignup", response.email);
        navigate("/otp-verification", {
          state: { email: response.email, message: response.message },
        });
      } else {
        navigate("/login");
      }

      resetForm();
    } catch (error: unknown) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[50px] px-8 pb-24">
          <form
            onSubmit={handleSubmit(onSubmit, (error) =>
              console.log("error:", error)
            )}
          >
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

            {/* Header */}
            <h1 className="text-center text-primary font-bold text-4xl pb-6">
              Organization
            </h1>

            {/* Organization Name Field */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-responsive-xs text-primary mb-2"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your organization name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="block text-base text-primary mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className={`my-0 w-full px-3 py-2 border ${
                  errors.description ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-vertical`}
                placeholder="Describe your organization .."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-base text-primary mb-2"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  defaultValue=""
                  className={`w-full px-3 text-primary py-2 border ${
                    errors.category ? "border-red-500" : "border-primary"
                  } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none pr-8`}
                  {...register("category")}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {organizationCategoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-base text-primary mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-responsive-xs text-primary mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
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
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile Picture Field */}
            <div className="mb-6">
              <label className="block text-responsive-xs text-primary mb-2">
                Organization Picture
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
                  organizationSignupMutation.isPending
                    ? "Signing up..."
                    : "Sign up"
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
              Want to be a member?{" "}
              <Link to="/signup-member" className="text-secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
