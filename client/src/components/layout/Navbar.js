import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import PropTypes from 'prop-types';

class AppNavbar extends Component {
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <NavbarBrand href="/">QR Generator</NavbarBrand>
                </Navbar>
            </div>
        );
    }
}

AppNavbar.propTypes = {};

export default AppNavbar;
