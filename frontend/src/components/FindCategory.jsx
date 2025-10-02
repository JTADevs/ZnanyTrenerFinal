import React, { useRef, useState, useEffect } from "react";

function FindCategory() {
    const categories = [
        { id: 1, name: "Trenerzy siłowni", image: "/images/trener_silowni.jpg" },
        { id: 2, name: "Trenerzy crossfitu", image: "/images/trener_crossfitu.jpg" },
        { id: 3, name: "Trenerzy basenowy", image: "/images/trener_plywania.jpg" },
        { id: 4, name: "Trenerzy biegania", image: "/images/trener_biegania.jpg" },
        { id: 5, name: "Trenerzy kolarstwa", image: "/images/trener_kolarstwa.jpg" },
        { id: 6, name: "Trenerzy fitness", image: "/images/trener_fitness.jpg" },
        { id: 7, name: "Trenerzy pilatesu", image: "/images/trener_pilates.jpg" },
        { id: 8, name: "Trenerzy jogi", image: "/images/trener_joga.jpg" },
        { id: 9, name: "Trenerzy sztuk walki", image: "/images/trener_walk.jpg" },
        { id: 10, name: "Trenerzy triathlonu", image: "/images/trener_thriathlon.jpg" },
        { id: 11, name: "Trenerzy online", image: "/images/trener_online.jpg" },
        { id: 12, name: "Trenerzy wspinaczki", image: "/images/trener_wspinaczki.jpg" },
        { id: 13, name: "Trenerzy kulturystyki", image: "/images/trener_kulturystyki.jpg" },
        { id: 14, name: "Trzenerzy snowboardingu", image: "/images/trener_snowboardingu.jpg" },
        { id: 15, name: "Trenerzy stretchingu", image: "/images/trener_stretchingu.jpg" },
        { id: 16, name: "Trzenerzy kickboxingu", image: "/images/trener_kickboxingu.jpg" },
    ];

    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const carousel = carouselRef.current;
        if (carousel) {
            const atStart = carousel.scrollLeft < 10;
            const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
            setCanScrollLeft(!atStart);
            setCanScrollRight(!atEnd);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        checkScrollability();
        
        carousel.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        
        return () => {
            carousel.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, []);

    const handleScroll = (direction) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const scrollAmount = carousel.clientWidth * 0.8;
            carousel.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="find-category">
            {/* NOWA STRUKTURA DLA TYTUŁU I STRZAŁEK */}
            <div className="title-with-arrows">
                <button 
                    className="scroll-btn" 
                    onClick={() => handleScroll('left')} 
                    disabled={!canScrollLeft}
                    aria-label="Przewiń w lewo"
                >
                    &#8249;
                </button>
                <h2>TRZENERZY WEDŁUG SPECJALIZACJI</h2>
                <button 
                    className="scroll-btn" 
                    onClick={() => handleScroll('right')} 
                    disabled={!canScrollRight}
                    aria-label="Przewiń w prawo"
                >
                    &#8250;
                </button>
            </div>

            {/* Karuzela jest teraz bezpośrednio pod nowym kontenerem */}
            <div className="carousel" ref={carouselRef}>
                {categories.map((cat) => (
                    <a href="">
                        <div key={cat.id} className="category-card">
                            <img src={cat.image} alt={cat.name} />
                            <div className="overlay">
                                <span>{cat.name}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default FindCategory;