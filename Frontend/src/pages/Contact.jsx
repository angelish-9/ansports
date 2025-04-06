import Title from "../components/Title";
import Navbar from "../components/Navbar";
import contact_img from "../assets/contact_img.png"


const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={contact_img}
          alt="Contact Image"
          className="w-full md:max-w-[480px]"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            Damak, Jhapa
          </p>
          <p className="text-gray-500">
            Tel: 9809606098<br /> Email: AnSportsZone.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Forever
          </p>
          <p className="text-gray-500">
            Learn more about our teams and shop.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Our Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
