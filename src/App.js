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
              <h1 className="font-weight-light">Jason Bradley Carpenter</h1>
              <a className="lead btn btn-dark" target="_blank" href="https://bread.codes/2020resume.pdf"><i className="far fa-file-pdf"></i> See My Resume</a>
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

function ProjectCard(p) {
  var proj = p['proj'];
  return (
    <div className="card">
      <img src={`/img/${proj.image}`} className="card-img-top" alt={`Image for ${proj.name}`} />
      <div className="card-body">
        <h5 className="card-title">{proj.name}</h5>
        <p className="card-text">{proj.description}</p>
        <button className="btn btn-primary" data-toggle="modal" data-target={`#${proj.modal}`}>Check it out!</button>
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
            <h3 className="pb-3"><small className="text-muted">6 of my favorite personal & professional projects</small></h3>
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
    <section className="section">
      <div className="container">
        <hr />
        <nav className="level">
          <div className="level-item has-text-centered">
            <div>
              <a href="https://github.com/mmacneil" className="icon is-large">
                <i className="fab fa-2x fa-github"></i>
              </a>
              <p className="heading"><a href="https://github.com/breadbored">github.com/breadbored</a></p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <a href="https://fullstackmark.com" className="icon is-large">
                <i className="fas fa-2x fa-globe"></i>
              </a>
              <p className="heading"><a href="https://bread.codes/">bread.codes</a></p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <a href="mailto:markmacneil@gmail.com" className="icon is-large">
                <i className="fas fa-2x fa-envelope"></i>
              </a>
              <p className="heading"><a href="mailto:brad@identex.co">brad@identex.co</a></p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <a href="https://www.linkedin.com/in/breadbored" className="icon is-large">
                <i className="fab fa-2x fa-linkedin-in"></i>
              </a>
              <p className="heading"><a href="https://www.linkedin.com/in/breadbored">linkedin</a></p>
            </div>
          </div>
        </nav>
      </div>
    </section>
  )
}

// TODO: Make this variable like the project cards
function Modals() {
  return (
    <>
      <div id="project-1-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">identex</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-1-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">

              <p><b>identex</b> is a paid service to fight fraud and give businesses analytics about their customers for marketing. <b>identex</b> is also privacy friendly as it does not store any identifiable information about our customer's clients.</p>
              <p><b>identex</b> goes beyond stopping fake IDs at bars, restaurants, liquor/beer stores, dispensaries, and pawn shops. <b>identex</b> is soon expanding into POS integration, stopping fraudulent online sales, and online verification services!</p>
              <p>I personally wrote the entire stack which includes: Android & iOS apps, web analytics dashboard, API, subscription management, and internal tools.</p>
              <p>Boeing IT manager and absolute legend, Hunter Hatch, is bringing the business end of the product where it needs to be. He is now officially our CEO at NARC.</p>

              <p><a href="https://identex.co/">Check it out!</a></p>

              <div className="tags">
                <span className="tag">python</span>
                <span className="tag">django</span>
                <span className="tag">java</span>
                <span className="tag">kotlin</span>
                <span className="tag">swift</span>
                <span className="tag">dart/flutter</span>
                <span className="tag">javascript</span>
                <span className="tag">html/css</span>
                <span className="tag">mongodb</span>
                <span className="tag">docker</span>
              </div>

            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-1-modal">Close</button>
          </footer>
        </div>
      </div>

      <div id="project-2-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">kikkit</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-2-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">

              <p>Kikkit is a freelance project we are currently working on at NARC. They reached out to us to build new features to their new forum. Their previous forum was based on Vanilla Forums. They wanted to combine the familiarity of Vanilla with the forum features of Reddit.</p>

              <p>Permission to display a demo was not yet given</p>

              <div className="tags">
                <span className="tag">symfony 5</span>
                <span className="tag">php</span>
                <span className="tag">postgresql</span>
                <span className="tag">docker</span>
                <span className="tag">nginx</span>
              </div>

            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-2-modal">Close</button>
          </footer>
        </div>
      </div>

      <div id="project-3-modal" class="modal" tabindex="-1">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">I Heart CBD</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-3-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">
              <p>A local business was interested in selling their CBD products online, so they hired us at NARC. The store itself is a WooCommerce store based on Wordpress, but we added custom features and extensions to their site to make it perfect for their needs.</p>

              <p><a href="https://westashleyiheartcbd.com/">Check it out!</a></p>

              <div className="tags">
                <span className="tag">wordpress</span>
                <span className="tag">woocommerce</span>
                <span className="tag">php</span>
                <span className="tag">mysql</span>
                <span className="tag">apache2</span>
              </div>
            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-3-modal">Close</button>
          </footer>
        </div>
      </div>

      <div id="project-4-modal" class="modal" tabindex="-1">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Pressure Them</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-4-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">
              <p>Pressure Them is a political project of mine. Crowdsourced police brutality data during the 2020 protests are displayed on a timeline with sources and videos for each entry. At the time of writing the site now has over 1070 instances of police brutality towards peaceful protestors, journalists, EMTs, and bystanders. Unfortunately the list continues to grow every day.</p>
              <p>It is important to me that we not only hold officials accountable for their deadly actions, but that we also keep our first admendment rights secure without fear of force taken against us. It is not a racial issue, it's a power issue, and we should stand together ✊🏻✊🏼✊🏽✊🏾✊🏿</p>

              <p><a href="https://pressurethem.com/">Check it out!</a></p>

              <div className="tags">
                <span className="tag">python</span>
                <span className="tag">flask</span>
                <span className="tag">javascript</span>
                <span className="tag">html/css</span>
                <span className="tag">docker</span>
              </div>
            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-4-modal">Close</button>
          </footer>
        </div>
      </div>

      <div id="project-5-modal" class="modal" tabindex="-1">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">QuantumRand</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-5-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">
              <p>A forked and restored version of QuantumRandom, QuantumRand is a random number generator generated from ANU's quantum computer. Random numbers on your computer alone are not always random, but QuantumRand gives a more secure way to generate RSA/SSL certificates and roll dice for Dungeons & Dragons!</p>

              <p><a href="https://github.com/identex/quantumrand/">Check it out!</a></p>

              <div className="tags">
                <span className="tag">python</span>
              </div>
            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-5-modal">Close</button>
          </footer>
        </div>
      </div>

      <div id="project-6-modal" class="modal" tabindex="-1">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">This Portfolio</p>
            <button className="delete" aria-label="close" data-toggle="modal" data-target="#project-6-modal"></button>
          </header>
          <section className="modal-card-body">

            <div className="content">
              <p>I wanted to learn a little more about React and how it can help my front-end projects, so I made my portfolio in React!</p>

              <p><a href="https://github.com/breadbored/breadbored.github.io/">Check out the source!</a></p>

              <div className="tags">
                <span className="tag">React</span>
                <span className="tag">NodeJS</span>
                <span className="tag">GitHub Pages</span>
              </div>
            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" data-toggle="modal" data-target="#project-6-modal">Close</button>
          </footer>
        </div>
      </div>
    </>
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
      <Modals/>
    </>
  );
}

export default MainPage;
