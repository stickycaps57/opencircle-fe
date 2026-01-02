import image1 from "@src/assets/landing/image1.jpg";
import image2 from "@src/assets/landing/image2.jpg";
import image3 from "@src/assets/landing/image3.jpg";

export default function DontMissOutComponent() {
  return (
    <section className="h-[100vh] py-24 text-white px-4 sm:px-6 lg:px-30">
      <div className="text-center">
        <div className="mb-16">
          <h2 className="text-responsive-2xl font-bold text-white">
            Don't Miss Out!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 xl:gap-36 h-full">
          <div className="flex flex-col items-center text-center p-7 h-full">
            <div className="w-full rounded-lg overflow-hidden mb-6">
              <img
                src={image1}
                alt="Event"
                className="w-full h-auto md:h-[150px] lg:h-[200px] object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">
              Charity Fun Run for a Cause
            </h3>
            <p className="text-responsive-xs text-white opacity-90">
              Join us in a fun-filled run dedicated to supporting a meaningful
              cause. This event brings together fitness, community, and
              compassion, as every step you take helps raise awareness and funds
              for those in need.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-7 h-full">
            <div className="w-full rounded-lg overflow-hidden mb-6">
              <img
                src={image2}
                alt="Event"
                className="w-full h-auto md:h-[150px] lg:h-[200px] object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">
              Planting Seeds of Tomorrow
            </h3>
            <p className="text-responsive-xs text-white opacity-90">
              Take part in our tree planting activity and help nurture a
              greener, healthier future. Together, we can restore nature, build
              stronger communities, and make a lasting impact—one tree at a
              time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-7 h-full">
            <div className="w-full rounded-lg overflow-hidden mb-6">
              <img
                src={image3}
                alt="Event"
                className="w-full h-auto md:h-[150px] lg:h-[200px] object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">
              Rhythm & Lights: A Rave Experience
            </h3>
            <p className="text-responsive-xs text-white opacity-90">
              Get ready to dance the night away with electrifying beats,
              dazzling lights, and nonstop energy. This rave party brings music
              lovers together for an unforgettable night of freedom, fun, and
              celebration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
