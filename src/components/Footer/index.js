import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <div>
                <footer
                    className="footer footer-black footer-white "
                    style={{ backgroundColor: "transparent" }}
                >
                    <div className="credits ">
                        <span className="copyright">
                            © {new Date().getFullYear()}, made with{" "}
                            <i className="fa fa-heart heart" /> by Me
                                </span>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer
