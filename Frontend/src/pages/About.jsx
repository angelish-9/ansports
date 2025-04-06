import Navbar from "../components/Navbar";
import football3 from "../assets/football3.jpg";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="my-24 flex flex-col md:flex-row gap-16">
        <img
          src={football3}
          alt="About Image"
          className="w-full md:max-w-[450px]"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            {`ANSports Zone was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.`}
          </p>
          <p>
            {`Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.`}
          </p>
          <strong className="text-gray-800">Our Mission</strong>
          <p>
            {`Our mission at ANSports Zone is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.`}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Quality Assurance:</strong>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Convenience:</strong>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Exceptional Customer Service:</strong>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you every step of the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
