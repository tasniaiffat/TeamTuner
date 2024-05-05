import './Header.css'
import Logo from'./Assets/TeamTuner.png'

function Header(){
    return(
        <div className='header'>
        <img src={Logo} alt='Logo' className="logo" />
        <h1 className="Title" id = 'name'>TeamTuner</h1>    
        </div>
    )
}

export default Header