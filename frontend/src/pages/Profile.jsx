import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Categories from "../data/categories";
import { useNavigate } from "react-router-dom";


function Profile(){
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [uid, setUid] = useState('');
    const [role, setRole] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [website, setWebsite] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if(loggedUser){
            const userData = JSON.parse(loggedUser);
            setUser(userData);
            setUid(userData.uid || ''); 
            setRole(userData.role || '');
            setDisplayName(userData.displayName || '');
            setEmail(userData.email || '');
            setCity(userData.city || '');
            setPhone(userData.phone || '');
            setFacebook(userData.facebook || '');
            setInstagram(userData.instagram || '');
            setWebsite(userData.website || '');
            setSelectedCategories(userData.categories || []);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
        prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        
        const data = {
            uid, displayName, email, city, phone, facebook, instagram, website, categories: selectedCategories
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.errors);
                return;
            }

            setSuccessMessage(responseData.message);
            const updatedUser = responseData.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setUser(updatedUser);
            setUid(updatedUser.uid || '');
            setRole(updatedUser.role || '');
            setDisplayName(updatedUser.displayName || '');
            setEmail(updatedUser.email || '');
            setCity(updatedUser.city || '');
            setPhone(updatedUser.phone || '');
            setFacebook(updatedUser.facebook || '');
            setInstagram(updatedUser.instagram || '');
            setWebsite(updatedUser.website || '');
            setSelectedCategories(updatedUser.categories || []);

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);

        } catch (error) {
            setError({ network: ['Nie można połączyć się z serwerem.'] });
        }
    }

    return (
        <div>
            <Header />
            <div className="profile-container">
                <h1>Edycja profilu: {displayName}</h1>
                <section>
                    {user && (
                        <form onSubmit={handleSubmit}>
                            <div className="profile-main-data">
                                <img src="images/photo.png" alt="zdjęcie profilowe" />
                                <input 
                                    type="text" 
                                    name="displayName" 
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)} 
                                    required
                                />
                                <input 
                                    type="text" 
                                    name="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required
                                />
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={city} 
                                    onChange={(e) => setCity(e.target.value)} 
                                    placeholder="Miasto"
                                />
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="Telefon"
                                />

                                {role == 'trainer' ? (
                                    <>
                                        <input 
                                            type="text" 
                                            name="facebook" 
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                            placeholder="Facebook"
                                        />
                                        <input 
                                            type="text" 
                                            name="instagram"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                            placeholder="Instagram"
                                        />
                                        <input 
                                            type="text" 
                                            name="website"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="Strona internetowa"
                                        />

                                        <div className="categories-container">
                                        <h3>Wybierz kategorie trenera:</h3>
                                        <div className="checkbox-scroll">
                                            {Categories.map((cat, index) => (
                                            <label key={index} className="checkbox-item">
                                                <input
                                                type="checkbox"
                                                value={cat}
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                                name="categories"
                                                />
                                                <span>{cat}</span>
                                            </label>
                                            ))}
                                        </div>
                                        </div>
                                    </>
                                    ) : null
                                }

                                {successMessage && <div className="success-message">{successMessage}</div>}
                                {error && (
                                    <div className="error-summary">
                                        <h4>Wystąpiły błędy:</h4>
                                        <ul>
                                            {Object.values(error).map((messages, index) => (
                                                messages.map((message, i) => <li key={`${index}-${i}`}>{message}</li>)
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button type="submit" className="profile-button">Zapisz</button>
                            </div>
                        </form>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;