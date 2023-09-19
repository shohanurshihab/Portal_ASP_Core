import React, { Component } from "react";

class LeftNav extends Component {

  render() {
    return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <a class="navbar-brand" href="/"><b>People</b></a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                  
                    {this.props.items.map((item) => (
                      <li key={item.href}>
                      <a class="nav-item nav-link active" href={item.href}>{item.label} <span class="sr-only"></span></a>
                      
                      </li>))
                    }
                  
                </div>
              </div>
            </nav>
    );
  }
}

export default LeftNav;
