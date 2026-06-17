import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowCircleRight } from "react-icons/hi";

export default function Home() {
    const [carouselIndex, setCarouselIndex] = useState(0);

    const carouselItems = [
        {
            title: "Lights From Horizon",
            description:
                "An enchanting evening filled with breathtaking performances and stunning visuals. Hosted at Temasek Polytechnic, this event celebrated creativity and artistry, bringing the stage to life with its captivating lights and immersive ambiance.",
            location: "Auditorium 1, TP",
            date: "2.7.2024",
            image: "/assets/LFH.jpg",
        },
        {
            title: "Captured Moments",
            description:
                "An artistic showcase that transformed ordinary frames into a stunning visual narrative. This unique setup highlighted the power of minimalism and creativity, with glowing lights adding warmth and depth to the atmosphere. Hosted on a cozy stage, it offered attendees an intimate and immersive experience.",
            location: "Temasek Polytechnic",
            date: "1.11.2023",
            image: "/assets/CPM.jpg",
        },
        {
            title: "Windows of Memories",
            description:
                "An evocative stage design where suspended frames and minimal props set the scene for a powerful narrative. The interplay of light and shadow drew the audience into the story, creating a visually captivating and emotionally moving experience.",
            location: "Temasek Polytechnic",
            date: "4.7.2023",
            image: "/assets/WoM.jpg",
        },
        {
            title: "Fog & Reflection",
            description:
                "An atmospheric performance set against a mysterious backdrop, where dim lights and drifting fog enveloped the stage in intrigue. The spotlight illuminated the lone figure, drawing the audience into a tale of solitude, drama, and emotion.",
            location: "Temasek Polytechnic",
            date: "2.2.2022",
            image: "/assets/F&R.jpg",
        },
        {
            title: "Evening With Shadows",
            description:
                "A poignant scene brought to life with minimalistic props and warm lighting that evoked a sense of nostalgia and intimacy. The silhouettes of the characters against the soft backdrop told a story of reflection and quiet conversations, creating a powerful atmosphere of stillness and emotion.",
            location: "Temasek Polytechnic",
            date: "28.6.2021",
            image: "/assets/EWS.jpg",
        },
    ];

    const nextCarouselItem = () => {
        setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    };

    const currentItem = carouselItems[carouselIndex];

    return (
        <>
            <div className="home-page">
                <div className="home-container">
                    <div className="home-content">
                        <h1>Welcome To</h1>
                        <h2>Temasek Polytechnic Film Club</h2>
                        <h3>Arising Starlights</h3>
                        <div className="button-container">
                            <Link to="/authentication">
                                <button className="join-btn">Join CCA</button>
                            </Link>
                            <Link to="/members">
                                <button className="join-btn">
                                    View Members
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="home-image">
                        <img src="/assets/stage_image.jpg" alt="Stage" />
                    </div>
                </div>
                <section className="about-container">
                    <h2>About Us</h2>
                    <div className="about-image">
                        <img src="/assets/AboutUs.jpg" alt="Theater stage" />
                    </div>
                    <p className="about-text">
                        Here, people who share similar interests gather to
                        pursue their passions, whether they be acting,
                        directing, set design, or just appreciating the art of
                        performance. We provide courses, events, and hands-on
                        activities that encourage collaboration, creativity, and
                        development because we believe that creativity has no
                        bounds.
                    </p>
                    <a href="/about" className="read-more">
                        Read More
                    </a>
                </section>
                <section className="highlights-container">
                    <h2>Highlights From The Past Events</h2>
                    <div className="highlight-card">
                        <div className="highlight-header">
                            <h3>{currentItem.title}</h3>
                        </div>
                        <div className="highlight-content">
                            <div className="highlight-image">
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                />
                            </div>
                            <div className="highlight-details">
                                <p>{currentItem.description}</p>
                                <p>
                                    <b>Location:</b> {currentItem.location}
                                </p>
                                <p>
                                    <b>Date:</b> {currentItem.date}
                                </p>
                            </div>
                        </div>
                        <button
                            className="arrow-btn"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "60px", // Circle size
                                height: "60px", // Circle size
                                backgroundColor: "white",
                                border: "none",
                                borderRadius: "50%", // Makes it a circle
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow
                                cursor: "pointer",
                            }}
                            onClick={nextCarouselItem}
                        >
                            <HiArrowCircleRight size={30} color="black" />
                        </button>
                    </div>
                </section>
                <footer className="social-footer">
                    <div className="social-links">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <i className="fab fa-youtube"></i>
                        </a>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}
