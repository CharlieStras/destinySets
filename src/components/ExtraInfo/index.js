import React from 'react';
import { uniqBy } from 'lodash';
import { connect } from 'react-redux';

import getItemExtraInfo from 'app/lib/getItemExtraInfo';
import Icon from 'app/components/Icon';

import styles from './styles.styl';

function ExtraInfo({
  className,
  item,
  inventoryEntry,
  vendorEntry,
  inCollection,
  vendorDefs
}) {
  const extraInfo = getItemExtraInfo(item, inventoryEntry).map(location => {
    return (
      <span>
        <span className={styles.greenTick}>
          <Icon icon="check" />
        </span>{' '}
        {location}
      </span>
    );
  });

  if (inCollection) {
    extraInfo.push(
      <span>
        <span className={styles.blueTick}>
          <Icon icon="check" />
        </span>{' '}
        {inventoryEntry.obtained
          ? 'Unlocked in Forsaken checklist'
          : 'Dismantled & unlocked in Forsaken checklist'}
      </span>
    );
  }

  return (
    <div className={className}>
      {vendorEntry &&
        uniqBy(vendorEntry, v => v.vendorHash).map(
          (singleVendorEntry, index) => {
            const vendor = vendorDefs[singleVendorEntry.vendorHash];

            return (
              <div key={index}>
                <span className={styles.orangeTick}>
                  <Icon icon="dollar-sign" />
                </span>{' '}
                Available from{' '}
                {vendor ? vendor.displayProperties.name : 'unknown vendor'}
              </div>
            );
          }
        )}

      {extraInfo.map((info, index) => <div key={index}>{info}</div>)}
    </div>
  );
}

export default connect(state => ({
  vendorDefs: state.definitions.vendorDefs
}))(ExtraInfo);
