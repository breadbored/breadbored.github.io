import React from 'react';
import './App.css';
import { getProjects } from './projects.js';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">bread.codes</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home
                    <span className="sr-only">(current)</span>
                  </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#portfolio">Portfolio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <div>
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center">
              <img src="/img/me-big.jpg" className="rounded-circle pb-3" alt="Picture of Jason"/>
              <h1 className="font-weight-light">Jason "Bread" Carpenter</h1>
              <a className="lead btn btn-dark" target="_blank" href="https://bread.codes/files/2020resume.pdf"><i className="far fa-file-pdf"></i> See My Resume</a>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

function AboutMe() {
  return (
    <section className="py-5" id="about">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>About Me</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p>I have been writing software since I was eleven years old and have always loved it. I am highly motivated and detail oriented when it comes to getting work done correctly the first time.</p>
            <p>Around 2014-2015 I was learning to write apps for Android and I made a very basic barcode scanner to roughly tell if a US Drivers License is valid. Through college I realized that my scanner was more accurate than a commercial product I was comparing it to at the time. Around 2018 I started working on identex, which can now stop fake IDs with over 96% accuracy. I loved turning that random project into a business, and that's what I do now at NARC!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard(proj) {
  var proj = proj['proj'];
  return (
    <div className="card">
      <img src={`/img/${proj.image}`} className="card-img-top" alt={`Image for ${proj.name}`} />
      <div className="card-body">
        <h5 className="card-title">{proj.name}</h5>
        <p className="card-text">{proj.description}</p>
        <a href={proj.link} className="btn btn-primary" target="_blank">{proj.beta ? `See the dev server` : `Check it out!`}</a>
      </div>
    </div>
  )
}

function PorfolioCardRow(projGroup) {
  return (
    <div className="row">
      {projGroup.projGroup.map(proj => (
        <div className="col-lg-4 col-sm-6 pb-5">
          <ProjectCard proj={proj}/>
        </div>
      ))}
    </div>
  )
}

function PortfolioCards() {
  var projects = getProjects();
  return (
    <section className="py-5" id="portfolio">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Portfolio</h2>
            <h3 className="pb-3"><small class="text-muted">6 of my favorite personal & professional projects</small></h3>
          </div>
        </div>
        {projects.map(projGroup => (
          <PorfolioCardRow projGroup={projGroup}/>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <section class="section">
      <div class="container">
        <hr />
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <a href="https://github.com/mmacneil" class="icon is-large">
                <i class="fab fa-2x fa-github"></i>
              </a>
              <p class="heading"><a href="https://github.com/breadbored">github.com/breadbored</a></p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <a href="https://fullstackmark.com" class="icon is-large">
                <i class="fas fa-2x fa-globe"></i>
              </a>
              <p class="heading"><a href="https://bread.codes/">bread.codes</a></p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <a href="mailto:markmacneil@gmail.com" class="icon is-large">
                <i class="fas fa-2x fa-envelope"></i>
              </a>
              <p class="heading"><a href="mailto:brad@identex.co">brad@identex.co</a></p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <a href="https://www.linkedin.com/in/breadbored" class="icon is-large">
                <i class="fab fa-2x fa-linkedin-in"></i>
              </a>
              <p class="heading"><a href="https://www.linkedin.com/in/breadbored">linkedin</a></p>
            </div>
          </div>
        </nav>
      </div>
    </section>
  )
}

function MainPage() {
  return (
    <>
      <NavBar/>
      <Header/>
      <AboutMe/>
      <PortfolioCards/>
      <Footer/>
    </>
  );
}

export default MainPage;
