function Header() {


    return(
        <header>
            <p><a href="/" className="nav-links">Znany trener</a></p>
            <p className="header-login">
                <a href="/login" className="nav-links">Logowanie</a>
                <a href="#" className="nav-links">Rejestracja</a>
            </p>
        </header>
    );
}

export default Header;