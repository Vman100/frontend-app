import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { createBrowserHistory } from "history";
import axios from "axios";
import './SignUp.scss';
const history = createBrowserHistory({ forceRefresh: true });

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpData: {
                userName: "",
                password: "",
                email: "",
                referralCode: "",
            },
            errors: { 
                userName: '', 
                password: '', 
                email: '', 
                referralCode: '',
                api: ''
            },
            isValidUserName: false,
            isValidPassword: false,
            isValidEmail: false,
            isValidReferralCode: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.userNameValidator = this.userNameValidator.bind(this);
        this.passwordValidator = this.passwordValidator.bind(this);
        this.emailValidator = this.emailValidator.bind(this);
        this.referralCodeValidator = this.referralCodeValidator.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            signUpData: {...prevState.signUpData, [name]: value},
        }));
    };

    // checks that the userName only contains letters, numbers, and the underscore character.
    userNameValidator(userName) {
        const userNamePattern = /^\w+$/
        console.log('userName check', userNamePattern.test(userName));
        if(userNamePattern.test(userName)) {
            this.setState({isValidUserName: true});
            this.setState(prevState => ({
                errors: { ...prevState.errors, userName: '' },
            }))
        } else {
            this.setState({isValidUserName: false});
            this.setState(prevState => ({
                errors: { ...prevState.errors, userName: 'userName must only include letters, digits, and underscore.' },
            }))
        }
        
    }

    //checks that the password covers the following conditions:
    //is between 8 to 20 characters long 
    //starts with a letter
    //contains least one uppercase letter, a lowercase letter, a number, and a special character.
    passwordValidator(password) {
        const passwordPattern = /^(?=[a-zA-Z])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
            console.log('password check', passwordPattern.test(password));
            if(passwordPattern.test(password)) {
                this.setState({isValidPassword: true});
                this.setState(prevState => ({
                    errors: { ...prevState.errors, password: '' },
                }))
            } else {
                this.setState({isValidPassword: false});
                this.setState(prevState => ({
                    errors: { ...prevState.errors, 
                        password: 'password must: * be at least 8 characters long, * start with a letter, * contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.'
                    },
                }))
            }
    }

    //checks the basic format of the email address
    emailValidator(email) {
        const emailPattern = /^[A-Za-z]\w+([.-]?\w+)*@[A-Za-z]+([.-]?[A-Za-z]+)*(\.\w{2,3})+$/;
        console.log('email check', emailPattern.test(email));
        if(emailPattern.test(email)) {
            this.setState({isValidEmail: true});
            this.setState(prevState => ({
                errors: { ...prevState.errors, email: '' },
            }))
        } else {
            this.setState({isValidEmail: false});
            this.setState(prevState => ({
                errors: { ...prevState.errors, email: 'email must be of the following format: <user>@<domain>.<tld>' },
            }))
        }
    };

    // checks that the referral code contains only numbers and is exactly five digits long.
    referralCodeValidator(referralCode) {
        const referralCodePattern = /^\d{5}$/
        console.log('referralCode check', referralCodePattern.test(referralCode));
        if(referralCodePattern.test(referralCode)) {
            this.setState({isValidReferralCode: true});
            this.setState(prevState => ({
                errors: { ...prevState.errors, referralCode: '' },
            }))
        } else {
            this.setState({isValidReferralCode: false});
            this.setState(prevState => ({
                errors: { ...prevState.errors, referralCode: 'referral code must only include exactly five digits.' },
            }))
        }
    }

    //valids the inputs then sends the data to the signup api and waits for a response.
    // if errors occur they will appear below their respective fields or below the signup button. 
    handleSubmit = async event => {
        event.preventDefault();
        const url = "http://178.128.233.31";
        const {signUpData} = this.state;
        await this.userNameValidator(signUpData.userName);
        await this.passwordValidator(signUpData.password);
        await this.emailValidator(signUpData.email);
        await this.referralCodeValidator(signUpData.referralCode);
        let {isValidUserName, isValidPassword, isValidEmail, isValidReferralCode} = this.state;
        if(isValidUserName && isValidPassword && isValidEmail && isValidReferralCode) {
            try {
                await axios.post(url + "/frontend/signup", {
                    code: signUpData.referralCode,
                    password: signUpData.password,
                    username: signUpData.userName,
                    email: signUpData.email
                }).then(res => {
                    console.log(res.data.code);
                    if(res.data.code==="Signup successful"){
                    //should let user check their email first
                        history.push("signIn");
                    }else{
                        this.setState(prevState => ({
                            errors: { ...prevState.errors, api: 'Sign up failed! Please try again!' },
                        }))
                    }
                })
            } catch (e) {
                return e.message
            } 
        }
    };

    render(){
        const {signUpData, errors} = this.state
        return (
        <div className="signin-container">
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" name="userName" placeholder="Uername" value={signUpData.userName} onChange={this.handleChange} required></input>
                        <span style={{color: "red"}}>{errors.userName}</span>
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="password" placeholder="Password" value={signUpData.password} onChange={this.handleChange} required></input>
                        <span style={{color: "red"}}>{errors.password}</span>
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" value={signUpData.email} onChange={this.handleChange} required></input>
                        <span style={{color: "red"}}>{errors.email}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" name="referralCode" placeholder="Referral code" value={signUpData.referralCode} onChange={this.handleChange} required></input>
                        <span style={{color: "red"}}>{errors.referralCode}</span>
                    </div>
                    <div >
                        <button type="submit" name="signIn" className=" btn btn-info signup-btn">Sign Up</button>
                        <span style={{color: "red"}}>{errors.api}</span>
                    </div>
                </form>
            </div>
            <div className="signup-options-container">
                <NavLink to="/signIn" className="signup-link" >Sign In</NavLink>
                <NavLink to="/forgotpassword" className="forgot-password-link">Forgot</NavLink>
            </div>
        </div>)
    }
}

export default SignUp;
