import axios from 'axios';


export default class ApiService {
    constructor(apiHost) {
        this._apiHost = apiHost;
        this.ApiErrors = {
            'COMMUNICATION_ERROR': 'Communication error',
        };
    }

    async isApiConnected() {
        console.log('asdf')
        let url = this._apiHost + '/is-connected';

        try {
            let response = await axios.get(url);

            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch(e) {
            console.log(e)
            throw new Error(this.ApiErrors.COMMUNICATION_ERROR);
        }
    }

    async auth(token) {
        let url = this._apiHost + '/auth';

        let headers = {
            'Content-type':'application/json', 
            'Accept':'application/json'
        };

        try {
            let response = await axios.post(url, token, {headers: headers});

            if (response.status !== 200) {
                throw new Error('Auth failed');
            }
        } catch(e) {
            console.log(e)
            throw new Error(this.ApiErrors.COMMUNICATION_ERROR);
        }
    }

    async write(uri) {
        let url = this._apiHost + '/write';

        let headers = {
            'Content-type':'application/json', 
            'Accept':'application/json'
        };

        let data = {
            'id': uri
        };

        try {
            let response = await axios.post(url, data, {headers: headers});

            if (response.status !== 200) {
                throw new Error('Write failed');
            }
        } catch(e) {
            console.log(e)
            throw new Error(this.ApiErrors.COMMUNICATION_ERROR);
        }
    }

};