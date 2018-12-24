import React, {Component} from 'react';
import {connect} from "react-redux";
import * as qs from 'query-string';
import {generateOffCode} from "../../actions/qrActions";
import PropTypes from 'prop-types';
import {Alert} from "react-bootstrap";
import {Input} from "reactstrap";
import classnames from 'classnames';
import Spinner from "../common/Spinner";

class Scan extends Component {

    state = {
        name: '',
        phone: '',
        email: '',
        loading: false,
        errors: {}
    };

    componentDidMount() {
        const {code} = qs.parse(this.props.location.search);
        this.props.generateOffCode(code);
    };


    componentWillReceiveProps(newProps) {
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    onSubmit = e => {
        e.preventDefault();


    };

    render() {
        let content;
        const {expire, max_use} = this.props.errors;
        const {code} = this.props.qrs.qr_data;
        const {loading} = this.props.qrs;

        if (loading) {

            content = <Spinner/>

        } else {

            if (expire || max_use) {
                content = (
                    <div>
                        {max_use && (
                            <Alert bsStyle="danger"><strong>{max_use}</strong></Alert>)}
                        {expire && (
                            <Alert bsStyle="danger"><strong>{expire}</strong></Alert>)}
                    </div>
                )
            } else {
                content = (

                    <div className="container">
                        <div className="col-md-8 m-auto">

                            <h2 className="display-4 text-center">Here is your Generated Code: </h2>
                            <p className="lead text-center">Code: <span
                                className="text-info font-weight-bold">{code}</span></p>

                            <div className="mt-5 mb-5"/>
                            <hr/>

                            <h1 className="display-4 text-center">Info</h1>
                            <p className="lead text-center">Please Enter your information for getting points</p>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.amount
                                        })}
                                        name="name"
                                        placeholder="Please Enter your name"
                                        value={this.state.name}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.amount
                                        })}
                                        name="phone"
                                        placeholder="Please Enter your phone number"
                                        value={this.state.phone}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.amount
                                        })}
                                        name="email"
                                        placeholder="please enter your email"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <Input type="submit" value="Send" className="btn btn-info btn-block"/>
                                </div>
                            </form>
                        </div>

                    </div>
                )
            }

        }


        return (
            <div>
                {content}
            </div>
        );
    }
}

Scan.propTypes = {
    generateOffCode: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    qrs: state.qrs,
    errors: state.errors
});

export default connect(mapStateToProps, {generateOffCode})(Scan);