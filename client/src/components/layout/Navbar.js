import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {connect} from "react-redux";

class AppNavbar extends Component {


    render() {
        const {is_navbar_visible} = this.props.nav;

        const navbar =
            (<Navbar color="dark" dark expand="sm">
                <NavbarBrand href="/">QR Generator</NavbarBrand>
            </Navbar>);

        return (
            <div>
                {is_navbar_visible && navbar}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    nav: state.navbar
});

export default connect(mapStateToProps)(AppNavbar);
