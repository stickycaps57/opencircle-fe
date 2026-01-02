import herobg from "@src/assets/landing/hero.jpg";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";

export default function HeroComponent() {
  // Scroll to call-to-action section
  const scrollToCallToAction = () => {
    const callToActionElement = document.getElementById("call-to-action");
    if (callToActionElement) {
      const elementRect = callToActionElement.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      window.scrollTo({
        top: middle,
        behavior: "smooth",
      });
    }
  };
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat relative flex items-end"
      style={{ backgroundImage: `url(${herobg})` }}
    >
      <div className="absolute inset-0 bg-herobg bg-opacity-50"></div>
      <div className="relative z-10 w-full pb-24 px-4 sm:px-6 lg:px-30">
        <div className="text-left text-white w-full lg:w-1/2">
          <h1 className="text-responsive-2xl md:text-responsive-4xl font-bold mb-8">
            A New Way to Connect, Share, and Grow Together
          </h1>
          <div className="text-responsive-xs md:text-responsive-sm space-y-2">
            <p>
              Imagine a space where organizations and individuals can come
              together — to post updates, host events, recruit members, and
              build real communities.
            </p>
            <p>Now, it's here.</p>
            <p>Create. Collaborate. Connect.</p>
            <p>
              This is more than just another social platform — it's where your
              circle begins.
            </p>
          </div>
          <div className="mt-8">
            <PrimaryButton
              variant="button2"
              label="Get Started"
              onClick={scrollToCallToAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
