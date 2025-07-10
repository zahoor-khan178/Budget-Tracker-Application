





import '../Css/nav copy.css';
// import '../Css/nav.query.css';
import { Link,  } from 'react-router-dom';



const Nav2 = () => {







    return (

        <div>
            <ul className='navbar2'>

           


                <li><Link to="/login" className='link2'>Log In</Link></li>
                <li><Link to="/sign" className='link2'>Sign Up</Link></li>
                
                
            </ul>
        </div>
    )
}

export default Nav2