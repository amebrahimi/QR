import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';

class AppNavbar extends Component {
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="sm">
                    <NavbarBrand href="/">QR Generator</NavbarBrand>
                </Navbar>
            </div>
        );
    }
}

export default AppNavbar;
