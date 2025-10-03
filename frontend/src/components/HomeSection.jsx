import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeSection() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <section className="home-section">
            <div className="home-section-container">
                <div className="home-section-img">
                    <img src="images/gym_section.jpg" alt="gym_section" />
                </div>
                <div className="home-section-content">
                    <h1>Twoja droga do zdrowia i formy zaczyna się tutaj.</h1>
                    <p>Połącz się z tysiącami trenerów i wybierz spośród setek gotowych programów treningowych. Niezależnie od celu – poprawa kondycji, siły czy sylwetki – mamy wszystko, czego potrzebujesz, by żyć zdrowiej i aktywniej.</p>
                    <div className="home-section-buttons">
                        <a href='/search-trainer'><div className="home-section-button button-one">Szukaj trenera</div></a>
                        <a href={user ? '/' : '/login'}><div className="home-section-button button-two">Dołącz</div></a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeSection;
