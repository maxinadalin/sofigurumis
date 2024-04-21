import { connect } from "react-redux";
import Layout from "../../hocs/layout";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { reset } from "../../redux/actions/payment";





function TanksYou({
    isAuthenticated,
    reset
}) {
    useEffect(() => {
        window.scrollTo(0, 0);
        reset()
      }, []);
    
    if (!isAuthenticated) {
        return <Navigate to={"/"}/>
    }


  return (
    <Layout>
    tanksyou
    </Layout>
  );
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  reset
})(TanksYou);
