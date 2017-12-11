import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import {
  languages,
  languageByCode,
  getDefaultLanguage,
  getBrowserLocale
} from 'app/lib/i18n';
import { trackEvent } from 'app/lib/analytics';
import styles from './styles.styl';

const PLATFORM = {
  1: 'Xbox',
  2: 'PlayStation',
  4: 'PC (Blizzard)',
  10: 'TigerDemon',
  254: 'BungieNext'
};

export default class Header extends React.Component {
  state = {
    accountSwitcherActive: false,
    langSwitcherActive: false
  };

  toggleAccountSwitcher = () => {
    this.setState({
      langSwitcherActive: false,
      accountSwitcherActive: !this.state.accountSwitcherActive
    });
  };

  toggleLangSwitcher = () => {
    this.setState({
      accountSwitcherActive: false,
      langSwitcherActive: !this.state.langSwitcherActive
    });
  };

  switchProfile = newProfile => {
    this.props.onChangeProfile(newProfile);
  };

  setLang = lang => {
    trackEvent(
      'switch-lang',
      [
        `loaded:${lang.code}`,
        `default:${getDefaultLanguage().code}`,
        `browser:${getBrowserLocale()}`
      ].join('|')
    );

    this.props.onChangeLang(lang);
  };

  render() {
    const {
      className,
      bg,
      profile,
      activeLanguage,
      isGoogleAuthenticated,
      onGoogleSignout
    } = this.props;
    const { langSwitcherActive, accountSwitcherActive } = this.state;

    const style = {};

    if (bg) {
      style.backgroundImage = `url(https://bungie.net${bg})`;
    }

    return (
      <div className={cx(className, styles.root)}>
        <div className={styles.header} style={style}>
          <div className={styles.main}>
            <Link to="/" className={styles.siteName}>
              D<span className={styles.longName}>estiny Sets </span>
              <span className={styles.version}>2</span>
            </Link>

            <Link
              to="/"
              className={styles.navItem}
              activeClassName={styles.active}
            >
              <span>Sets</span>
            </Link>

            <Link
              to="/all-items"
              className={styles.navItem}
              activeClassName={styles.active}
            >
              <span>All Items</span>
            </Link>

            <Link
              to="/data"
              className={cx(styles.navItem, styles.longName)}
              activeClassName={styles.active}
            >
              <span>Data Explorer</span>
            </Link>
          </div>

          <div className={styles.social}>
            <div
              className={styles.languageSwitcher}
              onClick={this.toggleLangSwitcher}
            >
              <div className={styles.currentLang}>
                <span className={styles.displayName}>
                  {activeLanguage && languageByCode[activeLanguage.code].name}
                </span>
              </div>
              <div className={styles.switchButton}>
                <i className="fa fa-caret-down" aria-hidden="true" />
              </div>

              {langSwitcherActive && (
                <div className={styles.langDropdown}>
                  {languages.map(lang => (
                    <div
                      key={lang.code}
                      className={styles.langOption}
                      onClick={() => this.setLang(lang)}
                    >
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {profile && (
              <div
                className={styles.accountSwitcher}
                onClick={this.toggleAccountSwitcher}
              >
                <div className={styles.account}>
                  <div className={styles.displayName}>
                    {profile.profile.data.userInfo.displayName}
                  </div>
                  <div className={styles.platform}>
                    {PLATFORM[profile.profile.data.userInfo.membershipType]}
                  </div>
                </div>
                <div className={styles.switchButton}>
                  <i className="fa fa-caret-down" aria-hidden="true" />
                </div>

                {accountSwitcherActive && (
                  <div className={styles.accountsDropdown}>
                    {this.props.profiles.map((prof, index) => (
                      <div
                        key={index}
                        className={cx(styles.account, styles.dropdownAccount)}
                        onClick={() => this.switchProfile(prof)}
                      >
                        <div className={styles.displayName}>
                          {prof.profile.data.userInfo.displayName}
                        </div>
                        <div className={styles.platform}>
                          {PLATFORM[prof.profile.data.userInfo.membershipType]}
                        </div>
                      </div>
                    ))}

                    {isGoogleAuthenticated && (
                      <div
                        onClick={onGoogleSignout}
                        className={cx(
                          styles.account,
                          styles.logOut,
                          styles.dropdownAccount
                        )}
                      >
                        Disconnect Google
                      </div>
                    )}

                    <div
                      onClick={() => this.switchProfile({ logout: true })}
                      className={cx(
                        styles.account,
                        styles.logOut,
                        styles.dropdownAccount
                      )}
                    >
                      Log out
                    </div>
                  </div>
                )}
              </div>
            )}

            <a
              className={styles.socialItem}
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/joshhunt"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              className={styles.socialItem}
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/joshhunt/destinySets"
            >
              <i className="fa fa-github" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
