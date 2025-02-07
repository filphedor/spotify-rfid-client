import axios from 'axios';

import createAlbumModel from '/util/create-album-model';


const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);

    return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
};


const VERIFIER_KEY = 'spotify-code-verifier';
const TOKEN_KEY = 'spotify-token';


export default class SpotifyService {
    constructor(options) {
        this._clientId = options.clientId;
        this._userCache = null;
    }

    async authenticate(redirectUri) {
        const codeVerifier = generateRandomString(100)
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        window.localStorage.setItem(VERIFIER_KEY, codeVerifier);

        const params =  {
            response_type: 'code',
            client_id: this._clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    async setUpToken(redirectUri, code) {
        const url = 'https://accounts.spotify.com/api/token';
        let codeVerifier = window.localStorage.getItem(VERIFIER_KEY);

        let response = await axios.post(
            url, 
            {
                client_id: this._clientId,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code: code,
                code_verifier: codeVerifier,
            }, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        window.localStorage.setItem(TOKEN_KEY, JSON.stringify(response.data));
    }

    getFullToken() {
        return JSON.parse(window.localStorage.getItem(TOKEN_KEY));
    }

    async logOut() {
        window.localStorage.setItem(TOKEN_KEY, null);
        this._userCache = null;
    }

    async getUser() {
        if (this._userCache) {
            return this._userCache;
        }

        let accessToken = this.getFullToken().access_token;
        
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const data = response.data;

        if (data.error) {
            throw new Error(data.error)
        }

        this._userCache = data;

        return data;
    }

    async searchAlbums(search) {
        let accessToken = this.getFullToken().access_token;

        const url = new URL("https://api.spotify.com/v1/search")

        const params =  {
            q: search,
            type: 'album'
        };

        url.search =  new URLSearchParams(params).toString();
        const response = await axios.get(url.toString(), {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const data = response.data;

        return data.albums.items.map((t) => {
            return createAlbumModel(t);
        });
    }
}