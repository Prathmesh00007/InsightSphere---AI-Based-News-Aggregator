import React from 'react';
import image1 from '../../assets/sanket-img.jpeg';
import image2 from '../../assets/prathamesh-img.jpeg';
import image3 from '../../assets/shantanu-img.jpg';
import image4 from '../../assets/swayam-img.jpeg';

const About = () => {
  const members = [
    { name: 'Sanket K. Belekar', role: 'FrontEnd Developer', image: image1, href: "https://www.linkedin.com/in/sanket-belekar-79210228a/" },
    { name: 'Prathamesh A. Ranade', role: 'BackEnd Developer', image: image2, href: "https://www.linkedin.com/in/prathmesh-ranade-13a42b265/" },
    { name: 'Shantanu P. Patil', role: 'UI Designer and Developer', image: image3, href: "https://www.linkedin.com/in/shantanu-patil-83b3ab290/" },
    { name: 'Swayam Dusing', role: 'BackEnd Developer', image: image4, href: "https://www.linkedin.com/in/swayam-dusing-45b7192b6/" },
  ];

  return (
    <div className="container mx-auto py-16 px-6">
      {/* Page Heading */}
      <h1 className="relative text-5xl font-extrabold text-center text-gray-900 mb-16 heading">
        About Us
      </h1>

      {/* Mission Section */}
      <section className="mb-14">
        <h2 className="relative text-4xl font-bold text-gray-800 mb-6 text-center heading">
          Our Mission
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
          To leverage AI technology to deliver timely, accurate, and insightful news that empowers individuals and organizations to make informed strategic decisions.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mb-14 bg-gray-100 py-10 rounded-lg shadow-md">
        <h2 className="relative text-4xl font-bold text-gray-800 mb-6 text-center heading">
          Our Vision
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
          We envision a world where AI-driven insights keep people informed of critical global developments, ensuring that decision-makers can act with precision and confidence.
        </p>
      </section>

      {/* Members Section */}
      <section className="mb-14">
        <h2 className="relative text-4xl font-bold text-gray-800 mb-6 text-center heading">
          Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 transition transform hover:scale-105 hover:shadow-xl text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-200"
              /> {/* Member Image */}
              <h3 className="relative text-2xl font-semibold text-gray-900 mb-2 heading">
                {member.name}
              </h3>
              <p className="text-lg text-gray-700 mb-4">{member.role}</p>

              {/* LinkedIn Icon */}
              <div className="flex justify-center items-center space-x-2">
                <a
                  href={member.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 transition"
                >
                  <i className="fab fa-linkedin fa-2x"></i> {/* Font Awesome LinkedIn icon */}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-14 bg-gray-50 py-10 px-6 rounded-lg shadow-lg">
        <h2 className="relative text-4xl font-bold text-gray-800 mb-6 text-center heading">
          Our Values
        </h2>
        <ul className="list-disc list-inside text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          <li>Integrity in delivering unbiased, accurate information.</li>
          <li>Innovation in applying AI technologies to news aggregation.</li>
          <li>Commitment to excellence in serving our users' needs.</li>
        </ul>
      </section>

      {/* Story Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-10 px-6 rounded-lg shadow-md">
        <h2 className="relative text-4xl font-bold text-gray-800 mb-6 text-center heading">
          Our Story
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          InsightSphere started with a vision to redefine how news is consumed in an age of information overload. By combining cutting-edge AI with an intuitive user experience, we’ve built a platform that allows users to stay informed about the topics that matter most to them.
        </p>
      </section>
    </div>
  );
};

export default About;
