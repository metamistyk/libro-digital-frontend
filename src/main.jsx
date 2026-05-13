import React from 'react'
import ReactDOM from 'react-dom/client'

import { Auth0Provider } from '@auth0/auth0-react'

import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>

        <Auth0Provider

            domain="dev-hnxz55jjtq1inapb.us.auth0.com"

            clientId="7OGvZ3Y0AB9dPiWHsMWgnRjWTa7bs1lv"

            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: 'https://libro-digital-api'
            }}

            cacheLocation="localstorage"

            useRefreshTokens={true}

        >

            <App />

        </Auth0Provider>

    </React.StrictMode>
)