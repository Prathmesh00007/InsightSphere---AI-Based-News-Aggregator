import React from 'react';
import prathameshImg from '../../assets/prathamesh-img.jpeg';

const About = () => {
  // Define only one member object
  const member = { 
    name: 'Prathamesh A. Ranade', 
    role: 'BackEnd Developer', 
    image: prathameshImg, 
    href: "https://www.linkedin.com/in/prathmesh-ranade-13a42b265/" 
  };

  return (
    <div className="container mx-auto py-16 px-6">
      {/* Page Heading */}
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-16">
        About Me
      </h1>

      {/* Mission Section */}
      <section className="mb-14">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          My Mission
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
          I leverage cutting-edge AI to deliver news and insights that empower people to make smart, informed decisions.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mb-14 bg-gray-100 py-10 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          My Vision
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
          I envision a future where AI seamlessly integrates with news consumption, keeping you ahead and well-informed.
        </p>
      </section>

      {/* Single Card for Myself */}
      <section className="mb-14">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Meet Me
        </h2>
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 transition transform hover:scale-105 hover:shadow-xl text-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-200"
            />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {member.name}
            </h3>
            <p className="text-lg text-gray-700 mb-4">{member.role}</p>
            <div className="flex justify-center items-center space-x-2">
              <a
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 transition"
              >
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-14 bg-gray-50 py-10 px-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          My Values
        </h2>
        <ul className="list-disc list-inside text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          <li>Integrity – delivering accurate and honest information.</li>
          <li>Innovation – harnessing AI for smarter solutions.</li>
          <li>Excellence – commitment to every project I undertake.</li>
        </ul>
      </section>

      {/* Story Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-10 px-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          My Story
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          I started InsightSphere driven by a passion for technology and a commitment to keep everyone informed. My journey in tech is fueled by curiosity, innovation, and the desire to make a difference.
        </p>
      </section>
    </div>
  );
};

export default About;
