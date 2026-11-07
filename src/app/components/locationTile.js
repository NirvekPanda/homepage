"use client";
import React, { useEffect, useRef, useState } from 'react';
import { API_BASE, useBackgroundUpdater } from '../utils/backgroundUpdater';

const MAP_SIZE = 240;

export default function LocationTile() {
  const { locationData } = useBackgroundUpdater();
  const [isOpen, setIsOpen] = useState(false);
  // Image ids the map has been requested for / finished loading / failed for.
  // Keyed by id so a background change never shows the previous location's map.
  const [activatedId, setActivatedId] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const containerRef = useRef(null);

  const imageId = locationData?.id;
  const { latitude, longitude, city, country } = locationData || {};
  const hasCoords =
    Boolean(imageId) &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);
  const canShowMap = hasCoords && failedId !== imageId;
  const showPopover = isOpen && canShowMap;

  const open = () => {
    if (canShowMap) setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // Each map load is a billed Google request, so only request it while the popover is open.
  // If the background changes while open, this follows it to the new image's map.
  useEffect(() => {
    if (isOpen && canShowMap) setActivatedId(imageId);
  }, [isOpen, canShowMap, imageId]);

  // Touch has no hover: close on a tap outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen]);

  const altText = city && country ? `Map of ${city}, ${country}` : 'Map of photo location';
  const mapReady = loadedId === imageId;

  return (
      <div
        ref={containerRef}
        className="relative flex items-center justify-center py-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/50 dark:focus-visible:ring-slate-500"
        tabIndex={canShowMap ? 0 : undefined}
        role={canShowMap ? 'button' : undefined}
        aria-expanded={canShowMap ? showPopover : undefined}
        aria-label={canShowMap ? `Show map of ${locationData?.name || 'photo location'}` : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onClick={open}
        onFocus={open}
        onBlur={close}
        onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
      >
        <svg
          width="20"
          height="20"
          viewBox="4 0 32 32"
          fill="currentColor"
          className="text-black dark:text-white flex-shrink-0 transition-colors duration-200"
        >
          <path d="M16,18a5,5,0,1,1,5-5A5.0057,5.0057,0,0,1,16,18Zm0-8a3,3,0,1,0,3,3A3.0033,3.0033,0,0,0,16,10Z"/>
          <path d="M16,30,7.5645,20.0513c-.0479-.0571-.3482-.4515-.3482-.4515A10.8888,10.8888,0,0,1,5,13a11,11,0,0,1,22,0,10.8844,10.8844,0,0,1-2.2148,6.5973l-.0015.0025s-.3.3944-.3447.4474ZM8.8125,18.395c.001.0007.2334.3082.2866.3744L16,26.9079l6.91-8.15c.0439-.0552.2783-.3649.2788-.3657A8.901,8.901,0,0,0,25,13,9,9,0,1,0,7,13a8.9054,8.9054,0,0,0,1.8125,5.395Z"/>
        </svg>
        <span className="text-black dark:text-white text-base font-medium transition-all duration-200 max-w-[360px] text-center leading-tight">
          {locationData?.name || 'Location'}
        </span>

        {canShowMap && (
          <div
            data-testid="location-map-popover"
            aria-hidden={!showPopover}
            className={`absolute top-full -right-4 mt-3 z-50 w-60 h-60 overflow-hidden rounded-lg border border-white/30 dark:border-gray-700/30 shadow-lg bg-white/90 dark:bg-gray-800/90 pointer-events-none transform transition-all duration-300 ease-in-out ${
              showPopover ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'
            }`}
          >
            {!mapReady && (
              <div className="absolute inset-0 animate-pulse bg-white/40 dark:bg-gray-700/40" />
            )}
            {activatedId === imageId && (
              <img
                key={imageId}
                src={`${API_BASE}/images/map/${imageId}?w=${MAP_SIZE}&h=${MAP_SIZE}`}
                alt={altText}
                width={MAP_SIZE}
                height={MAP_SIZE}
                className={`w-full h-full object-cover transition-opacity duration-300 ${mapReady ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoadedId(imageId)}
                onError={() => setFailedId(imageId)}
              />
            )}
          </div>
        )}
      </div>
  );
}
