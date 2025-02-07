import './bundle.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import SpotifyRadio from '/components/spotify-radio/spotify-radio';

import Dependencies from './util/dependencies';

import SpotifyService from './services/spotify-service';
import ApiService from './services/api-service';
import NotificationService from './services/notification-service';

let spotifyService = new SpotifyService({'clientId': process.env.SPOTIFY_CLIENT_ID});
let apiService = new ApiService(process.env.API_HOST);
let notificationService = new NotificationService();

Dependencies.addDependency('spotifyService', spotifyService);
Dependencies.addDependency('apiService', apiService);
Dependencies.addDependency('notificationService', notificationService);

const root = createRoot(document.getElementById('root'));
root.render(<SpotifyRadio/>);
