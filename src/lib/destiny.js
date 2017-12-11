import { sortBy } from 'lodash';

const XUR_URL = 'https://d392b4140pqfjy.cloudfront.net/xur';

const log = require('app/lib/log')('http');

const componentProfiles = 100;
const componentProfileInventories = 102;
const componentCharacters = 200;
const componentCharacterInventories = 201;
const componentCharacterActivities = 204;
const componentCharacterEquipment = 205;
const componentItemInstances = 300;
const componentItemSockets = 305;
const componentItemCommonData = 307;
const componentKiosks = 500;

const COMPONENTS = [
  componentProfiles,
  componentProfileInventories,
  componentCharacters,
  componentCharacterInventories,
  componentCharacterActivities,
  componentCharacterEquipment,
  componentItemInstances,
  componentItemCommonData,
  componentItemSockets,
  componentKiosks
];

export function get(url, opts) {
  return fetch(url, opts).then(res => res.json());
}

export function getDestiny(_pathname, opts = {}, postBody) {
  const url = `https://www.bungie.net${_pathname}`;
  const { pathname } = new URL(url);

  const apiKey =
    window.DESTINYSETS_ENV === 'beta'
      ? process.env.BETA_API_KEY
      : process.env.API_KEY;

  opts.headers = opts.headers || {};
  opts.headers['x-api-key'] = apiKey;

  if (window.AUTH_DATA) {
    opts.headers['Authorization'] = `Bearer ${window.AUTH_DATA.accessToken}`;
  }

  if (postBody) {
    opts.method = 'POST';
    opts.headers['Content-Type'] = 'application/json';
    opts.body =
      typeof postBody === 'string' ? postBody : JSON.stringify(postBody);
  }

  log(`REQUEST: ${pathname}`, opts);

  return get(url, opts).then(resp => {
    log(`RESPONSE: ${pathname}`, resp);

    if (resp.ErrorStatus === 'DestinyAccountNotFound') {
      return null;
    }

    if (resp.ErrorCode !== 1) {
      throw new Error(
        'Bungie API Error ' +
          resp.ErrorStatus +
          ' - ' +
          resp.Message +
          '\nURL: ' +
          url
      );
    }

    const result = resp.Response || resp;

    return result;
  });
}

export function getProfile({ membershipType, membershipId }, components) {
  return getDestiny(
    `/Platform/Destiny2/${membershipType}/Profile/${
      membershipId
    }/?components=${components.join(',')}`
  );
}

export function getCurrentProfiles() {
  let bungieNetUser;

  return getDestiny('/Platform/User/GetMembershipsForCurrentUser/')
    .then(body => {
      bungieNetUser = body.bungieNetUser;

      return Promise.all(
        body.destinyMemberships.map(ship => getProfile(ship, COMPONENTS))
      );
    })
    .then(profiles => {
      log('profiles:', profiles);
      const sortedProfiles = sortBy(
        profiles
          .filter(Boolean)
          .filter(profile => profile.profile.data.versionsOwned !== 0),
        profile => {
          return new Date(profile.profile.data.dateLastPlayed).getTime();
        }
      ).reverse();

      log('sortedProfiles:', sortedProfiles);

      return {
        profiles: sortedProfiles,
        bungieNetUser
      };
    });
}

export function getCurrentProfile() {
  return getCurrentProfiles().then(profiles => {
    const latestChars = profiles.sort((profileA, profileB) => {
      return (
        new Date(profileB.profile.data.dateLastPlayed) -
        new Date(profileA.profile.data.dateLastPlayed)
      );
    })[0];

    // TODO: validate that all fields got their data

    return latestChars;
  });
}

export function xur() {
  return get(XUR_URL).then(xurData => {
    const isLive = window.location.href.includes('forceXur') || xurData.isLive;
    return isLive
      ? { xurItems: xurData.itemsHashes, xurExtraText: xurData.extraText }
      : [];
  });
}
