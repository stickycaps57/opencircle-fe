type Variant =
  | "button1"
  | "button2"
  | "button3"
  | "activeEventButton"
  | "pendingEventButton"
  | "joinStatusButton"
  | "joinStatusButton2"
  | "rsvpButton"
  | "leaveOrgButton"
  | "acceptButton"
  | "declineButton"
  | "removeButton"
  | "iconButton"
  | "viewMoreButton"
  | "shareButton" 
  | "linkXsButton"
  | "noStyle";

interface ButtonProps {
  label: string;
  responsiveLabel?: string; // Label to show on small screens
  buttonClass?: string;
  variant?: Variant;
  icon?: string;
  iconPosition?: "left" | "right";
  iconClass?: string; // New prop for custom icon styling
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  contentClass?: string;
}

const variantClasses: Record<Variant, string> = {
  button1:
    "border py-3 px-6 w-[160px] lg:w-[220px] text-responsive-xs rounded-full text-white border-primary bg-primary",
  button2:
    "border-2 py-3 px-6 w-[160px] lg:w-[220px] text-responsive-xs rounded-full text-white border-white bg-transparent",
  button3:
    "border-2 py-3 px-6 w-full text-responsive-xs rounded-full text-white border-white bg-primary",
  activeEventButton:
    "border-2 py-1 px-6 border-[#9BCB99] text-[#9BCB99] text-responsive-xxs rounded-full",
  pendingEventButton:
    "border-2 py-1 px-6 border-secondary text-secondary text-responsive-xxs rounded-full",
  joinStatusButton:
    "bg-primary text-white py-[6px] px-6 rounded-full flex items-center text-responsive-xxs",
  joinStatusButton2:
    "text-primary py-[2px] rounded-full flex items-center text-responsive-xxs",
  rsvpButton:
    "border-2 py-1 px-6 border-primary text-primary text-responsive-xxs rounded-full",
  leaveOrgButton: "px-6 py-1 border border-red-700 rounded-full text-red-700 text-responsive-xxs",
  acceptButton:
    "px-6 py-1 bg-primary text-white text-responsive-xxs rounded-full",
  declineButton:
    "px-6 py-1 border border-primary text-responsive-xxs rounded-full",
  removeButton:
    "px-6 py-1 border border-primary text-responsive-xxs rounded-full",
  iconButton:
    "bg-primary text-white p-2 rounded-full flex items-center text-responsive-xxs",
  viewMoreButton: "text-authlayoutbg text-responsive-xxs",
  shareButton: "text-primary font-semibold text-responsive-xs hover:underline",
  linkXsButton: "text-authlayoutbg text-responsive-xxss hover:underline bg-transparent p-0",
  noStyle: ""
};

// Default icon classes for each position
const defaultIconClasses = {
  left: "mr-4",
  right: "ml-4",
} as const;

export function PrimaryButton({
  label,
  responsiveLabel,
  buttonClass = "",
  variant = "button1",
  icon,
  iconPosition = "left",
  iconClass, // Custom icon class
  type = "button",
  onClick,
  contentClass,
}: ButtonProps) {
  const baseClass = "btn";
  const combinedClass =
    `${baseClass} ${variantClasses[variant]} ${buttonClass} transition-none`.trim();

  // Use custom iconClass if provided, otherwise use default
  const getIconClass = () => {
    if (iconClass) {
      return iconClass; // Use custom class (completely overrides default)
    }
    return defaultIconClasses[iconPosition]; // Use default spacing
  };

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <span className={`flex justify-center items-center w-full ${contentClass ?? "text-responsive-xs"} text-center`}>
        {icon && iconPosition === "left" && (
          <img src={icon} alt="icon" className={getIconClass()} />
        )}
        {responsiveLabel ? (
          <>
            <span className="hidden sm:inline">{label}</span>
            <span className="inline sm:hidden">{responsiveLabel}</span>
          </>
        ) : (
          label
        )}
        {icon && iconPosition === "right" && (
          <img src={icon} alt="icon" className={getIconClass()} />
        )}
      </span>
    </button>
  );
}
