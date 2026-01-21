import logo from "../assets/logo1.png";

export default function Header() {
  return (
    <div className="bg-[#075E89] h-20">
        {/* <img className="h-auto w-full bg-cover bg-center relative" src={Curve} />
      <img src={logo} alt="" className="w-[200px] h-[60px] absolute top-18 left-10" /> */}
        <ul className="absolute hidden md:flex space-x-20 font-medium text-xl top-5 right-10">
          <li className=" text-[#2EC0FF] cursor-pointer"><a href="">Home</a></li>
          <li className="hover:text-[#2EC0FF] text-white cursor-pointer"><a href="">Activities</a></li>
          <li className="hover:text-[#2EC0FF] text-white cursor-pointer"><a href="">Resourses</a></li>
          <li className="hover:text-[#2EC0FF] text-white cursor-pointer"><a href="">Blog</a></li>
        </ul>
    </div>
  );
}
