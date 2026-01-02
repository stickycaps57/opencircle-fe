import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { Link } from "react-router-dom";

export default function CallToActionComponent() {
  return (
    <section
      id="call-to-action"
      className="h-[50vh] bg-white py-24 px-4 sm:px-6 lg:px-30"
    >
      <div className="h-full flex flex-col justify-center">
        <div className="mb-24 text-center">
        <h2 className="text-responsive-2xl font-bold">
          Ready to Join the Circle?
        </h2>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
          <div className="flex flex-col justify-center text-center">
            <p className="text-responsive-xs mb-6">
              Connect with communities, join events, and engage with content
              that matters to you. Be part of something bigger.
            </p>
            <div>
              <Link to="/signup-member">
                <PrimaryButton variant="button1" label="Member" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center text-center">
            <p className="text-responsive-xs mb-6">
              Create and manage your own community. Post updates, host events,
              and recruit members to grow your cause or organization
            </p>
            <div>
              <Link to="/signup-org">
                <PrimaryButton variant="button1" label="Organization" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
