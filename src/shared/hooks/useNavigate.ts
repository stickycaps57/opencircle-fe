import { useNavigate, type NavigateOptions } from "react-router-dom";

export function useRedirect() {
  const navigate = useNavigate();

  return (path: string, options?: NavigateOptions) => {
    navigate(path, options);
  };
}
