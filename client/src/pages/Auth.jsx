
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../Auth.css";

export default function Authentication() {
    return (
        <div
            className="auth-container"
            style={{ backgroundImage: `url(${"/assets/Auth.jpg"})` }}
        >
            <div className="auth-box">
               
                <img
                    src="/assets/TPLogo.jpg"
                    alt="Temasek Polytechnic"
                    className="logo"
                />
                <h2>Welcome To Our CCA !!!</h2>
                <h3>Arising Starlights</h3>

                <div className="auth-buttons">
                <Link to="/memberAuth">
    <button className="view-btn">Sign In As Member</button>
</Link>
<Link to="/adminAuth">
    <button className="view-btn">Sign In As Admin</button>
</Link>

                </div>
                <a href="/members" className="public-link">
                    View As Public
                </a>
            </div>
        </div>
    );
}
