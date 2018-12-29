import React, {Component} from 'react';
import {connect} from "react-redux";
import {useOffCode} from "../../actions/userQrActions";
import {hideNavbar} from "../../actions/authActions";
import PropTypes from 'prop-types';
import classNames from 'classnames';

class UseOffCode extends Component {

    state = {
        off_code: '',
        qrs: {},
        errors: {}
    };

    componentDidMount() {
        this.props.hideNavbar();
    }


    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    static getDerivedStateFromProps(props, state) {

        if (props.errors) {

            return {
                errors: props.errors
            }
        } else if (props.qrs) {

            return {
                qrs: props.qrs.off_data
            }
        } else {
            return null;
        }

    }

    onSubmit = e => {
        e.preventDefault();

        const data = {
            code: this.state.off_code
        };
        this.props.useOffCode(data);
        this.setState({off_code: ''})
    };

    render() {
        const {errors, qrs} = this.state;
        return (
            <div className="container">
                <div className="jumbotron">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Code Checker</h1>
                            <p className="lead text-center">Enter the Code to get the type of the Off code and use
                                it</p>

                            <hr className="my-4"/>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="offCodeInput" className="lead my-3">OffCode</label>
                                    <input type="text"
                                           className={classNames('form-control form-control-lg mb-2', {
                                               'is-invalid': errors.code
                                           })}
                                           id="offCodeInput"
                                           placeholder="Please Enter the code..."
                                           name="off_code"
                                           value={this.state.off_code}
                                           onChange={this.onChange}/>
                                    {errors.code && (<div className="invalid-feedback">{errors.code}</div>)}
                                </div>

                                <input type="submit" value="submit" className="btn btn-block btn-info mt2"/>
                            </form>

                            {qrs.type && (<h2 className="text-center display-4 text-secondary my-4"><span
                                className="text-primary">The type Of the code is : </span>{qrs.type}</h2>)}
                            {errors.error && (
                                <h2 className="text-center display-4 text-danger my-4">{errors.error}</h2>)}
                            {errors.used && (
                                <h2 className="text-center display-4 text-danger my-4">{errors.used}</h2>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UseOffCode.propTypes = {
    useOffCode: PropTypes.func.isRequired,
    hideNavbar: PropTypes.func.isRequired,
    qrs: PropTypes.object.isRequired,
    errors: PropTypes.object,
};

const mapStateToProps = state => ({
    qrs: state.qrs,
    errors: state.errors
});

export default connect(mapStateToProps, {useOffCode, hideNavbar})(UseOffCode);