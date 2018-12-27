import React, {Component} from 'react';
import classnames from 'classnames';
import {Container, Form, FormGroup, Input, Row} from 'reactstrap';
import {connect} from "react-redux";
import {loginUser, showNavbar} from "../../actions/authActions";
import PropTypes from 'prop-types';

class Login extends Component {

    state = {
        user: '',
        password: '',
        errors: {}
    };

    onSubmit = e => {
        e.preventDefault();

        const {user, password} = this.state;

        const loginData = {
            user,
            password
        };

        this.props.loginUser(loginData);
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {

        this.props.showNavbar();

        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }

    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    render() {
        const {errors} = this.state;
        return (
            <div>
                <Container className="mt-5">
                    <Row>
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to QR Generator Panel</p>
                            <Form onSubmit={this.onSubmit}>

                                <FormGroup>
                                    <Input
                                        type="text"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': errors.user
                                        })}
                                        name="user"
                                        placeholder="Enter your user Name"
                                        value={this.state.user}
                                        onChange={this.onChange}
                                    />
                                    {errors.user && (<div className="invalid-feedback">{errors.user}</div>)}
                                </FormGroup>

                                <FormGroup>
                                    <Input
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': errors.password
                                        })}
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                </FormGroup>

                                <Input type="submit" value="Submit" className="btn btn-info btn-block mt-2 "/>
                            </Form>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    showNavbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {loginUser, showNavbar})(Login);
