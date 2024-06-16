import './Home.css'; // Archivo CSS para animaciones
import logo from '../assets/HOMELOGO.png';

function Home() {
  return (
    <div className="home" style={{height: '100vh', textAlign: 'center' }}>
      <div className="content" style={{ padding: '20px' }}>
        <img src={logo} alt="Plamesa Logo" className='plamesa-logo' />
      
        <h1 className="animated-text">¡Bienvenido a Plamesa!</h1>
        <p className="animated-subtext">Planifica menús saludables y variados. Accede a información detallada y personaliza tus comidas con facilidad. </p>
      </div>
    </div>
  );
};

export default Home;