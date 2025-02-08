import Button from "../Button";

function CTA() {
  return (
    <section className="bg-background_light_secondary dark:bg-background_dark_secondary w-full   text-center py-20 px-5">
      <div className="container mx-auto text-center flex flex-col gap-10">
        <h1 className="dark:text-text_dark text-text_light text-4xl sm:text-5xl font-semibold">
          Ready to Start Your Music Stream?
        </h1>
        <p className="text-base md:text-lg  dark:text-white">
          Join MusicStream today and experience a new way of sharing and
          enjoying music with friends.
        </p>
        <Button>Get Started For Free</Button>
      </div>
    </section>
  );
}

export default CTA;
