
import { connect } from "react-redux"
import { check_authenticated,load_user,refresh } from "../redux/actions/auth"
import { useEffect } from "react";
import NavBar from "components/navigation/navBar";
import Footer from "components/navigation/footer";


function Layout({ children, check_authenticated,load_user,refresh }) {
     useEffect(() => {
    //Dispatch your actions here
       check_authenticated();
       load_user();
       refresh();
     }, [check_authenticated, load_user, refresh]);
return(
    <div >
        <NavBar/>
        {children}
        <Footer/>
    </div>
)

}

const mapStateToProps = state => ({
    
})

export default connect (mapStateToProps,{
     check_authenticated,
     load_user,
     refresh
}) (Layout)