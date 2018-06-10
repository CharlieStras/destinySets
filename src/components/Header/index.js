/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import logo from 'app/logo.svg';
import xur from 'app/assets/xur_icon.png';
import { DONATION_LINK } from 'app/components/DonateButton';
import Icon from 'app/components/Icon';
import GoogleAuthButton from 'app/components/GoogleAuthButton';
import DonateButton from 'app/components/DonateButton';
import ProfileDropdown from './ProfileDropdown';
import LanguageDropdown from './LanguageDropdown';

import ClickOutside from 'react-click-outside';

import styles from './styles.styl';

function isOverflowing(el) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}

const link = (name, to) => ({ name, to });
const LINKS = [
  link('Base', '/'),
  link('All Seasons', '/all-seasons'),
  link('Curse of Osiris', '/curse-of-osiris'),
  link('Warmind', '/warmind'),
  link('Strikes', '/strike-gear'),
  link('All Items', '/all-items'),
  link('Data Explorer', '/data')
];

const SOCIALS = [
  link('paypal', DONATION_LINK),
  link('twitter', 'https://twitter.com/joshhunt'),
  link('github', 'https://github.com/joshhunt/destinySets')
];

const SiteName = () => (
  <div className={styles.siteName}>
    <img src={logo} className={styles.logo} alt="" />
    <div>Destiny Sets</div>
  </div>
);

const SiteLinks = ({ displayXur, openXurModal, xurHasNewItems }) => (
  <Fragment>
    <div className={styles.dummyLink} />

    {LINKS.map(({ name, to }) => (
      <NavLink
        key={to}
        className={styles.link}
        activeClassName={styles.active}
        to={to}
      >
        {name}
      </NavLink>
    ))}

    {displayXur && (
      <a
        onClick={() => openXurModal(true)}
        className={cx(styles.xurLink, xurHasNewItems && styles.xurLinkNewItems)}
      >
        <img className={styles.xurIcon} src={xur} alt="" />
        Xûr
      </a>
    )}
  </Fragment>
);

const SocialLinks = () => (
  <Fragment>
    {SOCIALS.map(({ name, to }) => (
      <a
        key={to}
        className={styles.socialLink}
        href={to}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon icon={name} brand />
      </a>
    ))}
  </Fragment>
);

function sidebarClickOutside(toggleSidebar, isOpen, ev) {
  if (isOpen) {
    ev.preventDefault();
    toggleSidebar();
  }
}

function Sidebar({
  isOpen,
  language,
  setLanguage,
  displayGoogleAuthButton,
  googleSignIn,
  toggleSidebar,
  displayXur,
  openXurModal,
  xurHasNewItems
}) {
  return (
    <ClickOutside
      className={styles.sidebar}
      onClickOutside={sidebarClickOutside.bind(null, toggleSidebar, isOpen)}
    >
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarTop}>
          <SiteName />
          <button className={styles.toggleSidebar} onClick={toggleSidebar}>
            <Icon icon="times" />
          </button>
        </div>

        <SiteLinks
          displayXur={displayXur}
          openXurModal={openXurModal}
          xurHasNewItems={xurHasNewItems}
        />

        <div className={styles.hr} />

        {language && (
          <LanguageDropdown
            inline={true}
            language={language}
            setLanguage={setLanguage}
          />
        )}
        <br />

        {displayGoogleAuthButton && <GoogleAuthButton onClick={googleSignIn} />}

        <div className={styles.sidebarExtra}>
          <DonateButton />

          <div>
            <SocialLinks />
          </div>
        </div>
      </div>
    </ClickOutside>
  );
}

export default class Header extends Component {
  state = { isOverflowing: false, sidebarActive: false };

  componentDidMount() {
    window.addEventListener('resize', this.checkOverflow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkOverflow);
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow = () => {
    if (this.state.isOverflowing) {
      return;
    }

    if (isOverflowing(this.linksRef)) {
      this.setState({ isOverflowing: true });
    }
  };

  setLinksRef = ref => {
    this.linksRef = ref;
  };

  toggleSidebar = () => {
    this.setState({ sidebarActive: !this.state.sidebarActive });
  };

  render() {
    const {
      authExpired,
      currentProfile,
      allProfiles,
      switchProfile,
      language,
      setLanguage,
      logout,
      googleAuth,
      displayGoogleAuthButton,
      googleSignIn,
      googleSignOut,
      displayXur,
      xurHasNewItems,
      openXurModal
    } = this.props;

    const { isOverflowing, sidebarActive } = this.state;

    return (
      <div
        className={cx(
          styles.root,
          isOverflowing && styles.isOverflowing,
          sidebarActive && styles.sidebarActive
        )}
      >
        {isOverflowing && (
          <Sidebar
            {...this.props}
            isOpen={sidebarActive}
            toggleSidebar={this.toggleSidebar}
          />
        )}

        <div className={styles.fixed}>
          {isOverflowing && (
            <button
              className={styles.toggleSidebar}
              onClick={this.toggleSidebar}
            >
              <Icon icon="bars" />
            </button>
          )}

          <SiteName />

          <div className={styles.links} ref={this.setLinksRef}>
            <SiteLinks
              displayXur={displayXur}
              openXurModal={openXurModal}
              xurHasNewItems={xurHasNewItems}
            />
          </div>

          <div className={styles.etc}>
            {displayGoogleAuthButton &&
              !isOverflowing && <GoogleAuthButton onClick={googleSignIn} />}

            {language &&
              !isOverflowing && (
                <LanguageDropdown
                  language={language}
                  setLanguage={setLanguage}
                />
              )}

            {currentProfile && (
              <ProfileDropdown
                authExpired={authExpired}
                currentProfile={currentProfile}
                allProfiles={allProfiles}
                switchProfile={switchProfile}
                logout={logout}
                googleSignOut={googleSignOut}
                googleAuthSignedIn={googleAuth.signedIn}
              />
            )}

            <SocialLinks />
          </div>
        </div>
      </div>
    );
  }
}
