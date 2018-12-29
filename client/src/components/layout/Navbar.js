import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {connect} from "react-redux";

class AppNavbar extends Component {

    state = {
        isOpen: false
    };


    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };


    render() {
        const {nav: {is_navbar_visible}, auth: {isAuthenticated}} = this.props;
        const {isOpen} = this.state;

        const loggedInNavbar = (
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink className="nav-link" href="/dashboard/statistics">Statistics</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        );

        const navbar =
            (<Navbar color="dark" dark expand="md">
                <NavbarBrand href="/dashboard">QR Generator</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                {isAuthenticated && loggedInNavbar}
            </Navbar>);

        return (
            <div>
                {is_navbar_visible && navbar}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    nav: state.navbar,
    auth: state.auth
});

export default connect(mapStateToProps)(AppNavbar);
