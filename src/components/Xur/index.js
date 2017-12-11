import React from 'react';

import xur from 'app/xur.png';

import Item from 'app/components/Item';

import styles from './styles.styl';

export default function Xur({ items, extraText }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.root}>
      <img className={styles.xurImage} src={xur} alt="" />

      <div className={styles.main}>
        <h2 className={styles.heading}>
          Xûr is selling items you haven't collected yet!
        </h2>

        <div className={styles.items}>
          {items.map((item, i) => (
            <Item className={styles.item} item={item} key={i} />
          ))}
        </div>

        {extraText ? (
          <p>{extraText}</p>
        ) : (
          <p>
            Visit the Xûr Megathread on{' '}
            <a
              href="https://reddit.com/r/destinythegame"
              target="_blank"
              rel="noopener noreferrer"
            >
              /r/DestinyTheGame
            </a>{' '}
            to find where he's been spotted this week.
          </p>
        )}
      </div>
    </div>
  );
}
