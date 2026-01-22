// import bgCurve from "../assets/bg.png"
// import  bgCurve  from '../assets/bgCurve1.svg';
// import  cloud  from '../assets/cloud.svg';
import bulb from "../assets/bulb.svg";
import body from "../assets/body.svg";
import Header from "../components/header";  
function App() {
  return(
    
        <div >
        
      <Header  />
      <div className='bg-[#9CE1FF] flex flex-row items-center justify-center  w-full'>
      <div className=' flex flex-col gap-4 w-150 md:pl-8 lg:pl-16 '>
        <p className="text-[#075E89] text-[min(5vw,50px)] font-bold ">
      Software Engineering Arcane Network
    </p> 
    <p className='  text-[min(2vw,20px)] text-[#444444]'>A futuristic network connecting software enthusiasts 
with projects, mentorship, and industry opportunities.</p>
</div>

<img src={bulb} alt="" className='' />


      </div>

    
  
 <div className=' bg-[#DBF6FD] flex items-center justify-center flex flex-col gap-6 p-4 pb-10 pt-20'>

    <p className=' text-[#034362] font-semibold text-center mt-5 text-[min(3vw,50px)] '>SEAN for Engineers</p>
    <div className="bg-white rounded-3xl text-[min(2vw,24px)] p-10 text-[#444444] relative max-w-3xl w-full">
    Software Engineering Arcane Network is a student-led community created to connect passionate learners who want to grow and build in the world of technology together. Our club provides a supportive platform where students collaborate on software projects, share knowledge, and develop real-world skills through teamwork and innovation. 
  </div>

  <div className="flex flex-row items-center justify-center m-7 mt-50 [font-family:'Poppins-Regular',Helvetica]'">
    <img src={body} alt="" className=''/>
    <div className='p-2 w-full text-right '>
      <p className="text-[#2EC0FF] text-[min(3vw,50px)]  md:w-3/4 lg:w-0.556 [font-family:'Poppins-Regular',Helvetica] font-bold">This is where the Adventure Begins!</p>
      <p className=' text-[min(3vw,20px)] md:w-3/4 lg:w-0.6 text-[#444444]'>The Software Engineering Arcane Network nurtures a collaborative community where students work together, share ideas, and organize workshops, hackathons, and events that strengthen teamwork, innovation, and a supportive culture of learning and growth.Join us to participate in the fun!</p>
    </div>
  </div>

  

</div>

  </div>

      
      

      
    
      
   
    
    


  
  )


  
}

export default App