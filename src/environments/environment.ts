// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  // firebaseConfig: {
  //   apiKey: 'AIzaSyCeL3JzGaVoZcXpA6yT6AS45WsxXHgCkGs',
  //   authDomain: 'demoupload-d290c.firebaseapp.com',
  //   databaseURL: 'https://demoupload-d290c.firebaseio.com',
  //   projectId: 'demoupload-d290c',
  //   storageBucket: 'demoupload-d290c.appspot.com',
  //   messagingSenderId: '899408937177',
  //   appId: '1:899408937177:web:238166fb4441c2c214bec8',
  //   measurementId: 'G-8VMGBKT7D8'
  // }
  firebaseConfig : {
    apiKey: 'AIzaSyCTynL8nTO6f9V_89noiZs6RPWFW1FzqMY',
    authDomain: 'website-8b69b.firebaseapp.com',
    databaseURL: 'https://website-8b69b-default-rtdb.firebaseio.com',
    projectId: 'website-8b69b',
    storageBucket: 'website-8b69b.appspot.com',
    messagingSenderId: '73563541659',
    appId: '1:73563541659:web:edf37d1e340590bdd9b63e',
    measurementId: 'G-FXSPSKLXKQ'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
